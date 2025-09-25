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
import linkedinService from '../services/linkedinService.js';
import googleService from '../services/googleService.js';
export const OauthController={
  faceBookRedirect :async (req: Request, res: Response) => {
  try {
    const facebookUrl = await facebookService.generateAuthUrl();
    return res.redirect(facebookUrl);
  } catch (err) {
    console.error("Erro no redirect do Facebook:", err);
    return res.status(500).send("Erro ao iniciar login com Facebook");
  }
},
facebookCallback: async (req: Request, res: Response) => {
  const {code,state}=req.query as {code:string,state:string}
   if (!code || !state) return res.status(400).send("Código ou state ausente");
   try {
    await facebookService.verifyState(state)

    const accessToken=await facebookService.exchangeCodeforToken(code);
     const { email, name } = await facebookService.getUserProfile(accessToken);

   const user = await facebookService.findOrCreateUser(email, name);

    // 🔹 5. Gerar JWT e enviar cookie
    const userJwt = facebookService.generateAppToken(user);

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

linkedInRedirect:async(req:Request,res:Response)=>{
try {
  const linkedinUrl=await linkedinService.generateAuthUrl()
res.redirect(linkedinUrl)
} catch (error) {
   console.error("Erro no redirect do LinkedIn:", error);
    return res.status(500).send("Erro ao iniciar login com LinkedIn");
}
},
linkedInCallback:async(req:Request,res:Response)=>{
const {code,state}=req.query as {code:string,state:string}
  if (!code || !state)
    return res.status(400).send("Código ou state ausente");
  try {
      console.log("Callback LinkedIn iniciado");
  console.log("code:", code, "state:", state);
    await linkedinService.verifystate(state);
     console.log("✅ State verificado");
    const access_token=await linkedinService.exchangeLinkedinCodeForCode(code)
    console.log("✅ Access token:", access_token);
    const {email,name}=await linkedinService.getUserProfile(access_token)
    console.log("✅ Perfil LinkedIn:", { email, name });
    const user=await linkedinService.findOrCreateUser(email,name)
    console.log("✅ Usuário no sistema:", user);

    const userJwt=await linkedinService.generateAppToken(user)
      console.log("✅ Token gerado:", userJwt);
    
    res.cookie("comandas-token", userJwt, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 60 * 1000,
      sameSite: "lax",
      path: "/",
    });

    const mode = user.two_factor_secret ? "verify" : "setup";
    return res.redirect(
      `https://esadev.com.br/login/user/${user.id}?mode=${mode}`
    );
  } catch (err:any) {
     console.error(
      "Erro no callback do LinkedIn:",
      err.response?.data || err.message || err
    );
    return res
      .status(403)
      .send("State inválido, expirado ou erro na troca de token LinkedIn");
  }
},





  googleredirect:async(req:Request,res:Response)=>{
try {
  const googleUrl=await googleService.generateGoogleAuthUrl()
return res.redirect(googleUrl)
} catch (error) {
   console.error("Erro no redirect do Google:", error);
    return res.status(500).send("Erro ao iniciar login com Google");
}
  },
googlecallback: async (req: Request, res: Response) => {
  const { code, state } = req.query as { code: string; state: string };
  if (!code || !state) return res.status(400).send("Código ou state ausente");

  try {
    await googleService.verifyState(state);

    const { accessToken, idToken } = await googleService.exchangeCodeforToken(code);
    const { email, name } = await googleService.getUserProfile(idToken);

    const user = await googleService.findOrCreateUser(email, name);

    const userJwt = await googleService.generateAppToken(user);

    res.cookie("comandas-token", userJwt, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 60 * 1000,
      sameSite: "lax",
      path: "/",
    });

    const mode = user!.two_factor_secret ? "verify" : "setup";
    return res.redirect(`https://esadev.com.br/login/user/${user!.id}?mode=${mode}`);
  } catch (err: any) {
    console.error("Erro no callback do Google:", err.response?.data || err.message || err);
    return res.status(403).send("State inválido, expirado ou erro na troca de token Google");
  }},


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