import { UserModel } from "../models/User.js"
import { jwtService } from "./jwtService.js"
import axios from 'axios'
import crypto, { randomBytes } from 'crypto'
const facebookService={
generateAuthUrl:async(): Promise<string>=> {
    const newState = crypto.randomBytes(16).toString("hex");
    const stateJwt = jwtService.signToken({ state: newState }, "15m");
    const redirectUri=process.env.FACEBOOK_REDIRECT_URI!
    return (
      `https://www.facebook.com/v21.0/dialog/oauth?` +
      `client_id=${process.env.FACEBOOK_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=email,public_profile` +
      `&state=${encodeURIComponent(stateJwt)}` +
      `&response_type=code`
    );
  },

    verifyState:async(state:string)=>{
const decoded=jwtService.verifyTokenOauth<{state:string}>(decodeURIComponent(state))
 return decoded.state  
    },
    exchangeCodeforToken:async(code:string)=>{
        const tokenRes=await axios.get("https://graph.facebook.com/v18.0/oauth/access_token",{
        params:{
            client_id:process.env.FACEBOOK_CLIENT_ID!,
            client_secret:process.env.FACEBOOK_CLIENT_SECRET!,
            redirect_uri:process.env.FACEBOOK_REDIRECT_URI,
            code
        }
        })
        return tokenRes.data.access_token as string
    },
    getUserProfile:async(accessToken:string)=>{
        const userRes=await axios.get("https://graph.facebook.com/me",{
            params:{
                fields: 'id,name,email',
                access_token:accessToken
            },
            
        })
      const { id, name, email } = userRes.data;

  if (!email) throw new Error("Facebook não retornou email");

  return { id, name, email };
    },
    findOrCreateUser:async(email:string,name:string)=>{
                let user=await UserModel.findOne({where:{
                    email
                }})
                if(!user){
                    user=await UserModel.create({
                        email,name,password:'',role:'user'
                    })
                }
                return user
            },
 generateAppToken:async(user:any)=>{
    return jwtService.signToken({id:user.id,email:user.email},'15m')
 }
}
export default facebookService