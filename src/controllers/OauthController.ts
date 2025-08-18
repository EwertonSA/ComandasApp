import { Request, Response } from 'express'
import { authenticateFacebookUser } from '../services/instagramAuthService.js';
import { authenticateLinkedinUser, generateState } from '../services/linkedInAuthService.js';
import crypto from 'crypto'
import axios from 'axios'
import { jwtService } from '../services/jwtService.js';
import { JWT_KEY } from '../config/environment.js';

export const OauthController={
  
  facebookCallback:async(req: Request, res: Response)=> {
     console.log('Query recebida:', req.query);
       console.log('Callback recebido!');
 

  try {
    const code = req.query.code as string
    if (!code) {
      return res.status(400).json({ message: 'Código de autorização ausente' })
    }

    const { user, jwt } = await authenticateFacebookUser(code)

    // Define cookie HTTP-only (se quiser)
  res.cookie('comandas-token', jwt, {

  httpOnly: true,
  secure: true, // true só em produção (HTTPS)
  maxAge: 3600000,
  sameSite: 'lax',
  path: '/',
});


  
res.redirect('https://esadev.com.br/employeeApp')
  } catch (error) {
  console.error('Erro na autenticação:', error);
  return res.status(500).json({ message: 'Erro ao autenticar com Facebook' });
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
googleAuthcallback:async (req: Request, res: Response) => {
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