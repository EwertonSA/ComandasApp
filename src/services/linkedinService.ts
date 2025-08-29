import { jwtService } from "./jwtService.js";
import crypto, { randomBytes } from 'crypto'
import axios from 'axios'
import { UserModel } from "../models/User.js";

const linkedinService={
generateAuthUrl:async(): Promise<string>=>{
        const newState = crypto.randomBytes(16).toString("hex");
        const stateJwt = jwtService.signToken({ state: newState }, "15m");
        const redirectUri=process.env.REDIRECT_URI!
        return(
            `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code` +
      `&client_id=${process.env.LINKEDIN_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=openid%20profile%20email` +
      `&state=${encodeURIComponent(stateJwt)}` +
      `&prompt=consent%20login` 

        )
},
verifystate:async(state:string)=>{
    const decoded=jwtService.verifyTokenOauth<{state:string}>(decodeURIComponent(state))
 return decoded.state  
},
exchangeLinkedinCodeForCode:async(code:string)=>{
    const tokenRes=await axios.post("https://www.linkedin.com/oauth/v2/accessToken",
new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: "https://esadev.com.br/api/auth/linkedin/callback/", // mesmo URI do redirect
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
       const { access_token, id_token } = tokenRes.data;
       return tokenRes.data.access_token as string
    },
    getUserProfile:async(accessToken:string)=>{
     const profileRes = await axios.get("https://api.linkedin.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
       const { id, localizedFirstName, localizedLastName } = profileRes.data;
        const emailRes = await axios.get(
      "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const email = emailRes.data.elements[0]["handle~"].emailAddress;

    if (!email) throw new Error("LinkedIn não retornou email");

    const name = `${localizedFirstName} ${localizedLastName}`;

    return { id, name, email };
  },
    findOrCreateUser:async(email:string,name:string)=>{
        let user=await UserModel.findOne({where:{email}}) 
        if(!user){
            user=await UserModel.create({
                email,name,password:'',role:'user'
            })
        }
        return user
    },
      generateAppToken: async (user: any) => {
    return jwtService.signToken({ id: user.id, email: user.email }, "15m");
  },

}
export default linkedinService