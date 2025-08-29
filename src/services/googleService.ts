import crypto, { randomBytes } from 'crypto'
import { jwtService } from './jwtService.js';
import axios from 'axios'
import { UserModel } from '../models/User.js';
const googleService={
    generateGoogleAuthUrl:async()=>{
    const newState = crypto.randomBytes(16).toString("hex");
    const stateJwt=jwtService.signToken({state:newState},'15m')
    const redirectUri=process.env.GOOGLE_REDIRECT_URI!
    return(
        `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=openid%20email%20profile` +
      `&state=${encodeURIComponent(stateJwt)}` +
      `&prompt=consent`
    )
    },
    verifyState:async(state:string)=>{
const decoded=jwtService.verifyTokenOauth<{state:string}>(decodeURIComponent(state))
return decoded.state
    },
    exchangeCodeforToken:async(code:string)=>{
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

     return { accessToken: tokenRes.data.access_token, idToken: tokenRes.data.id_token };

    },
    getUserProfile:async(idToken:string)=>{
         const payload = JSON.parse(Buffer.from(idToken.split(".")[1], "base64").toString("utf-8"));
    const { email, name } = payload;

    if (!email) throw new Error("Google não retornou email");
    return { email, name };
    },
    findOrCreateUser:async(email:string,name:string)=>{
    const user=await UserModel.create({
        email,name,password:'',role:'user'
    })
    return user
    },
     generateAppToken:async(user:any)=>{
    return jwtService.signToken({id:user.id,email:user.email},'15m')
 }
}
export default googleService