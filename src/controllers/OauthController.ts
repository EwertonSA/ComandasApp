import { Request, Response, urlencoded } from 'express'
import { authenticateFacebookUser, exchangeCodeForToken, getFacebookUser } from '../services/instagramAuthService.js';
import { authenticateLinkedinUser, generateState } from '../services/linkedInAuthService.js';
import crypto, { randomBytes } from 'crypto'
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
    return res
      .status(403)
      .send("State inválido, expirado ou erro na troca de token LinkedIn");
  
  }
},
faceRedirect:async(req:Request,res:Response)=>{
  const newState=randomBytes(16).toString('hex')
  const stateJwt= jwtService.signToken({state:newState},'5m');
  const redirectUri=encodeURIComponent(`https://esadev.com.br/api/auth/instagram/callback`)
  const facebookUrl=`https://www.facebook.com/v21.0/dialog/oauth?` +
  `client_id=${process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID}` +
  `&redirect_uri=${redirectUri}` +
  `&scope=email,public_profile` +
   `&state=${encodeURIComponent(stateJwt)}` +
  `&response_type=code`;
  return res.redirect(facebookUrl)
},
facebookcallback:async(req:Request,res:Response)=>{
const {code,state}=req.query as {code:string,state:string};
if(!code|| !state) return res.status(400).send('Código ou state ausente')
try {
    const decodedState= jwtService.verifyTokenLinkedin<{state:string}>(decodeURIComponent(state))
const rawState=decodedState.state
const token=await axios.post(
   'https://www.linkedin.com/oauth/v2/accessToken',
   new URLSearchParams({
     grant_type: 'authorization_code',
    code,
    redirect_uri: process.env.REDIRECT_URI!,
    client_id: process.env.LINKEDIN_CLIENT_ID!,
    client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
 } ),
   { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
)
    const { access_token, id_token } = token.data;
  const decodedId = JSON.parse(
      Buffer.from(id_token.split('.')[1], 'base64').toString('utf-8')
    );

    if (!decodedId.email) {
      return res.status(400).send("ID Token do LinkedIn sem email");
    }

let user=await UserModel.findOne({where:{email:decodedId.email}})
if(!user){
  user=await UserModel.create({
      email: decodedId.email,
        name: decodedId.name,
        password: "",
        role:'user'
  })
}
const userJwt=jwtService.signToken({id:user.id,email:user.email},'30m')

   res.cookie("comandas-token", userJwt, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
      sameSite: "lax",
      path: "/",
    });
      const mode = user.two_factor_secret ? "verify" : "setup";
res.redirect(`https://esadev.com.br/login/user/${user.id}`);
} catch (error) {
    return res
      .status(403)
      .send("State inválido, expirado ou erro na troca de token LinkedIn");
}
},

linkedinRedirect:async(req:Request,res:Response)=>{
const newState=randomBytes(16).toString('hex')
const stateJwt=jwtService.signTokenLinkedin({state:newState},'15m')

  const redirectUri = 
      "https://esadev.com.br/api/auth/linkedin/callback/"
    
        const linkedinUrl =
      `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code` +
      `&client_id=${process.env.LINKEDIN_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=openid%20profile%20email` +
      `&state=${encodeURIComponent(stateJwt)}` +
      `&prompt=consent%20login`; // força consent + login

    return res.redirect(linkedinUrl);
},
linkedinCallback: async (req: Request, res: Response) => {
  const { code, state } = req.query as { code: string; state: string };
  if (!code || !state) return res.status(400).send("Código ou state ausente");

  try {
    // 🔹 Verifica state JWT
    const decodedState = jwtService.verifyTokenLinkedin<{ state: string }>(
      decodeURIComponent(state)
    );
    const rawState = decodedState.state;

    // 🔹 Troca code por tokens (access_token + id_token)
    const tokenRes = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: "https://esadev.com.br/api/auth/linkedin/callback/", // mesmo URI do redirect
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, id_token } = tokenRes.data;

    // 🔹 Decodifica ID Token do LinkedIn (não validar como JWT do app)
    const decodedId = JSON.parse(
      Buffer.from(id_token.split('.')[1], 'base64').toString('utf-8')
    );

    if (!decodedId.email) {
      return res.status(400).send("ID Token do LinkedIn sem email");
    }

    // 🔹 Procura usuário no DB
    let user = await UserModel.findOne({ where: { email: decodedId.email } });
    if (!user) {
      user = await UserModel.create({
        email: decodedId.email,
        name: decodedId.name,
        password: "",
        role: "user",
      });
    }

    // 🔹 Gera JWT próprio do app
    const userJwt = jwtService.signToken(
      { id: user.id, email: user.email },
      "1h"
    );

    // 🔹 Define cookie seguro
    res.cookie("comandas-token", userJwt, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
      sameSite: "lax",
      path: "/",
    });

    const mode = user.two_factor_secret ? "verify" : "setup";
    res.redirect(`https://esadev.com.br/login/user/${user.id}?mode=${mode}`);
  } catch (err: any) {
    console.error("Erro no callback do LinkedIn:", err.response?.data || err.message);
    return res
      .status(403)
      .send("State inválido, expirado ou erro na troca de token LinkedIn");
  }
},

linkedCallback: async (req: Request, res: Response) => {
  const { code, state } = req.query as { code: string; state: string };
  if (!code || !state) return res.status(400).send("Código ou state ausente");

  try {
    // 🔹 Verifica state JWT
    const decoded = jwtService.verifyTokenLinkedin<{ state: string }>(decodeURIComponent(state));
    const rawState = decoded.state;

    // 🔹 Troca code por tokens (access_token + id_token)
    const tokenRes = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: "https://esadev.com.br/api/auth/linkedin/callback/",
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, id_token } = tokenRes.data;

    // 🔹 Decodifica ID Token para pegar informações do usuário
 const decodedId = jwtService.verifyTokenLinkedin<{
      email: string;
      name: string;
    }>(id_token);

    let user = await UserModel.findOne({ where: { email: decodedId.email } });
    if (!user) {
      user = await UserModel.create({
        email: decodedId.email,
        name: decodedId.name,
        password: "",
        role: "user",
      });
    }

    // 🔹 Gera seu JWT para app
    const userJwt = jwtService.signToken({ id: user.id, email: user.email }, '1h');

    res.cookie("comandas-token", userJwt, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
      sameSite: "lax",
      path: "/",
    });

const mode = user.two_factor_secret ? "verify" : "setup";
res.redirect(`https://esadev.com.br/login/user/${user.id}?mode=${mode}`);
  } catch (err) {
    console.error("Erro no callback do LinkedIn:", err);
    return res.status(403).send("State inválido, expirado ou erro no LinkedIn");
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