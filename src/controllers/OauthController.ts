import { Request, Response } from 'express'
import { authenticateFacebookUser, exchangeCodeForToken, getFacebookUser } from '../services/instagramAuthService.js';
import { authenticateLinkedinUser, generateState } from '../services/linkedInAuthService.js';
import crypto from 'crypto'
import axios from 'axios'
import { jwtService } from '../services/jwtService.js';
import { UserModel } from '../models/User.js';
import { userService } from '../services/userService.js';

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
  const { code } = req.query;
  if (!code) return res.status(400).send("Código de autorização ausente");

  try {
    // Troca code por access_token
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code: code as string,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: "authorization_code",
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = tokenRes.data;

    const userInfoRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    const googleUser = userInfoRes.data;

    let user = await UserModel.findOne({ where: { email: googleUser.email } });
    if (!user) {
      user = await UserModel.create({
        email: googleUser.email,
        name: googleUser.name,
        password: "",
        role: "user",
      });
    }

  const mode = user.two_factor_secret ? "verify" : "setup";
res.redirect(`https://esadev.com.br/login/user/${user.id}`);

  } catch (err) {
    console.error("Erro no callback do Google:", err);
    return res.status(500).send("Erro ao autenticar com Google");
  }
},
googleVerify2fa:async(req:Request,res:Response)=>{
 const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "userId ausente" });

  try {
    const qrCodeData = await userService.get2faQRCode(userId as string);
    return res.json(qrCodeData);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
  },
validateRecaptcha:async(token: string)=> {
  const secret = process.env.RECAPTCHA_SECRET;

  const res = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    new URLSearchParams({ 
      secret:process.env.RECAPTCHA_SECRET as string,
      response: token,
    })
  );

  return res.data;
}
}