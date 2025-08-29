import { Request, Response, urlencoded } from 'express'
import { authenticateFacebookUser, exchangeCodeForToken, getFacebookUser } from '../services/instagramAuthService.js';
import { authenticateLinkedinUser, generateState } from '../services/linkedInAuthService.js';
import crypto, { randomBytes } from 'crypto'
import axios from 'axios'
import { jwtService } from '../services/jwtService.js';
import { UserModel } from '../models/User.js';
import { userService } from '../services/userService.js';
import base64url from "base64url";
import facebookService from '../services/facebookService.js';
export const OauthController={
  
facebookCallback: async (req: Request, res: Response) => {
  const {code,state}=req.query as {code:string,state:string}
   if (!code || !state) return res.status(400).send("Código ou state ausente");
   try {
    await facebookService.verifyState(state)

    const accessToken=await facebookService.exchangeCodeforToken(code);
     const { email, name } = await facebookService.getUserProfile(accessToken);

   const user = await facebookService.findOrCreateUser(email, name);

    // 🔹 5. Gerar JWT e enviar cookie
    const userJwt = facebookService.genetateAppToken(user);

    res.cookie("comandas-token", userJwt, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 60 * 1000,
      sameSite: "lax",
      path: "/",
    });

    // 🔹 6. Redirecionar para frontend
    const mode = user.two_factor_secret ? "verify" : "setup";
    return res.redirect(`https://esadev.com.br/login/user/${user.id}?mode=${mode}`);
  } catch (err: any) {
    console.error("Erro no callback do Facebook:", err.response?.data || err.message || err);
    return res.status(403).send("State inválido, expirado ou erro na troca de token Facebook");
    
   }
},
// Redirect para login do Facebook
faceRedirect: async (req: Request, res: Response) => {
  try {
    // 🔹 Gera state JWT
    const newState = crypto.randomBytes(16).toString("hex");
    const stateJwt = jwtService.signToken({ state: newState }, "15m");

    const redirectUri = "https://esadev.com.br/api/auth/facebook/callback";

    const facebookUrl =
      `https://www.facebook.com/v21.0/dialog/oauth?` +
      `client_id=${process.env.FACEBOOK_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=email,public_profile` +
      `&state=${encodeURIComponent(stateJwt)}` +
      `&response_type=code`;

    return res.redirect(facebookUrl);
  } catch (err) {
    console.error("Erro no redirect do Facebook:", err);
    return res.status(500).send("Erro ao iniciar login com Facebook");
  }
},

// Callback do Facebook
facebookcallback: async (req: Request, res: Response) => {
  const { code, state } = req.query as { code: string; state: string };

  if (!code || !state) return res.status(400).send("Código ou state ausente");

  try {
    // 🔹 Verifica state JWT
    const decodedState = jwtService.verifyTokenOauth<{ state: string }>(
      decodeURIComponent(state)
    );
    const rawState = decodedState.state;

    // 🔹 Troca code por access_token
    const tokenRes = await axios.get("https://graph.facebook.com/v18.0/oauth/access_token", {
      params: {
        client_id: process.env.FACEBOOK_CLIENT_ID!,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET!,
        redirect_uri: "https://esadev.com.br/api/auth/facebook/callback",
        code,
      },
    });

    const { access_token } = tokenRes.data;

    // 🔹 Busca dados do usuário
    const userRes = await axios.get("https://graph.facebook.com/me", {
      params: {
        fields: "id,name,email",
        access_token,
      },
    });

    const { email, name } = userRes.data;
    if (!email) return res.status(400).send("Facebook não retornou email");

    // 🔹 Cria ou busca usuário no banco
    let user = await UserModel.findOne({ where: { email } });
    if (!user) {
      user = await UserModel.create({
        email,
        name,
        password: "",
        role: "user",
      });
    }

    // 🔹 Gera JWT do app
    const userJwt = jwtService.signToken({ id: user.id, email: user.email }, "30m");

    // 🔹 Envia cookie seguro
    res.cookie("comandas-token", userJwt, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 60 * 1000,
      sameSite: "lax",
      path: "/",
    });

    // 🔹 Redireciona para frontend com 2FA
    const mode = user.two_factor_secret ? "verify" : "setup";
    res.redirect(`https://esadev.com.br/login/user/${user.id}?mode=${mode}`);
  } catch (err: any) {
    console.error("Erro no callback do Facebook:", err.response?.data || err.message || err);
    return res.status(403).send("State inválido, expirado ou erro na troca de token Facebook");
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
    const decodedState = jwtService.verifyTokenOauth<{ state: string }>(
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
    const decoded = jwtService.verifyTokenOauth<{ state: string }>(decodeURIComponent(state));
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
 const decodedId = jwtService.verifyTokenOauth<{
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
  
// Rota de redirect para Google
googleRedirect: async (req: Request, res: Response) => {
  try {
    // 🔹 Gera state JWT
    const newState = crypto.randomBytes(16).toString("hex");
    const stateJwt = jwtService.signToken({ state: newState }, "15m");

    const redirectUri = "https://esadev.com.br/api/auth/google/callback";

    const googleUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=openid%20email%20profile` +
      `&state=${encodeURIComponent(stateJwt)}`;

    return res.redirect(googleUrl);
  } catch (err) {
    console.error("Erro no redirect do Google:", err);
    return res.status(500).send("Erro ao iniciar login com Google");
  }
},

// Callback do Google
googleCallback: async (req: Request, res: Response) => {
  const { code, state } = req.query as { code: string; state: string };
  if (!code || !state) return res.status(400).send("Código ou state ausente");

  try {
    // 🔹 Verifica state JWT
    const decodedState = jwtService.verifyTokenOauth<{ state: string }>(
      decodeURIComponent(state)
    );
    const rawState = decodedState.state;

    // 🔹 Troca code por tokens
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: "https://esadev.com.br/api/auth/google/callback",
        grant_type: "authorization_code",
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, id_token } = tokenRes.data;

    // 🔹 Decodifica ID Token do Google
    const decodedId = JSON.parse(
      Buffer.from(id_token.split(".")[1], "base64").toString("utf-8")
    );

    if (!decodedId.email) {
      return res.status(400).send("ID Token do Google sem email");
    }

    // 🔹 Procura ou cria usuário no DB
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
    console.error("Erro no callback do Google:", err.response?.data || err.message);
    return res
      .status(403)
      .send("State inválido, expirado ou erro na troca de token Google");
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