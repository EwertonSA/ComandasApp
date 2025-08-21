import { Request, Response } from 'express'
import { authenticateFacebookUser, exchangeCodeForToken, getFacebookUser } from '../services/instagramAuthService.js';
import { authenticateLinkedinUser, generateState } from '../services/linkedInAuthService.js';
import crypto from 'crypto'
import axios from 'axios'
import { jwtService } from '../services/jwtService.js';
import { UserModel } from '../models/User.js';

export const OauthController={
  
facebookCallback: async (req: Request, res: Response) => {
  try {
    console.log('Callback recebido!');
    console.log('req.query:', req.query);

    const rawCode = req.query.code;
    let code: string;

    if (typeof rawCode === 'string') {
      code = rawCode;
    } else if (Array.isArray(rawCode) && rawCode.length > 0 && typeof rawCode[0] === 'string') {
      code = rawCode[0];
    } else {
      return res.status(400).json({ message: 'Código de autorização ausente ou inválido' });
    }

    console.log('Code extraído:', code);

    const { user, jwt } = await authenticateFacebookUser(code);

    res.cookie('comandas-token', jwt, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
      sameSite: 'lax',
      path: '/',
    });
    return res.redirect('https://esadev.com.br/employeeApp');
  } catch (error) {
    console.log('Err:',error)
    console.error('Erro detalhado:', JSON.stringify(error, null, 2));
    res.redirect('https://esadev.com.br/login/index');
  }
},

linkedInCallBack: async (req:Request, res:Response) => {
  function generateState(length = 16) {
  return crypto.randomBytes(length).toString("hex");
}
  const { code, state } = req.query as { code?: string; state?: string };

  // 1️⃣ Se não tem code → redireciona para LinkedIn com state
  if (!code) {
    const newState = generateState();
    req.session.linkedinState = newState;

    const redirectUri = encodeURIComponent(
      "https://esadev.com.br/api/auth/linkedin/callback/"
    );

    const linkedinUrl =
      `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code` +
      `&client_id=${process.env.LINKEDIN_CLIENT_ID}` +
      `&redirect_uri=${redirectUri}` +
      `&scope=r_liteprofile%20r_emailaddress` +
      `&state=${newState}` +
      `&prompt=consent%20login`; // força consent + login

    return res.redirect(linkedinUrl);
  }

  // 2️⃣ Callback do LinkedIn → validar state
  if (!state || state !== req.session.linkedinState) {
    return res.status(403).json({ error: "State inválido" });
  }

  try {
    delete req.session.linkedinState;

    // autentica usuário → troca code por token, busca dados, cria JWT
    const { user, jwt } = await authenticateLinkedinUser(code);

    // cookie com JWT
    res.cookie("comandas-token", jwt, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
      sameSite: "lax",
      path: "/",
    });

    // redireciona para app
    res.redirect("https://esadev.com.br/employeeApp");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao autenticar com LinkedIn" });
  }},
  
googleLogin: async (req: Request, res: Response) => {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
  const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

  const state = crypto.randomBytes(16).toString('hex'); // gerar state aleatório
  req.session.googleState = state;

  const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=openid%20email%20profile` +
    `&state=${state}`;

  res.redirect(googleUrl); // redireciona para login do Google
}
,
googleAuthcallback: async (req: Request, res: Response) => {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
  const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;

  const { code } = req.query;
  if (!code) return res.status(400).send("Código de autorização ausente");

  try {
    // 1. Troca o code por access token
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code: code as string,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = tokenRes.data;

    // 2. Buscar dados do usuário no Google
    const userInfoRes = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const googleUser = userInfoRes.data;

    // 3. Buscar usuário no banco
    let user = await UserModel.findOne({ where: { email: googleUser.email } });
    if (!user) {
      user = await UserModel.create({
        email: googleUser.email,
        name: googleUser.name,
    password: "", // placeholder
    role: "user", // ou qualquer role válida
      });
    }

   if (user.two_factor_secret) {
  // usuário já tem 2FA configurado → front só mostra input para digitar token
  return res.json({
    twoFARequired: true,
    userId: user.id,
    provider: "google"
  });
} else {
  // usuário ainda não tem 2FA → front mostra QR + input do token
  return res.json({
    twoFARequired: true,
    userId: user.id,
    provider: "google",
    requireSetup: true
  });

    }
  } catch (err) {
    console.error("Erro no callback do Google:", err);
    res.status(500).send("Erro ao autenticar com Google");
  }
},

googleAuthcall:async (req: Request, res: Response) => {
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
  const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
  const JWT_KEY = process.env.JWT_KEY!;

  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Código de autorização ausente");
  }

  try {
    // 1. Trocar o code por access token
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code: code as string,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = tokenRes.data;

    // 2. Buscar dados do usuário
    const userInfoRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const googleUser = userInfoRes.data; // { id, email, name, picture }

    // 3. Criar JWT válido
    const token = jwtService.signToken(
      {
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      },
      '1h'
    );

    // 4. Salvar cookie HTTP-only
    res.cookie("comandas-token", token, {
      httpOnly: true,
      secure: true, // true em produção com HTTPS
      maxAge: 3600000,
      sameSite: "lax",
      path: "/",
    });

    // 5. Redirecionar para o app
    res.redirect("https://esadev.com.br/employeeApp");

  } catch (err) {
    console.error("Erro no callback do Google:", err);
    res.status(500).send("Erro ao autenticar com Google");
  }
}
}