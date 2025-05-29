import jwt, { SignOptions } from 'jsonwebtoken'
import { JWT_KEY } from '../config/environment.js'

const secret=JWT_KEY
export const jwtService={
   
    signToken: (payload: string | object | Buffer, expiration: string): string => {
        return jwt.sign(payload, secret, { expiresIn: expiration } as SignOptions)
        
      },
      verifyToken:(token:string,callbackfn:jwt.VerifyCallback)=>{
        jwt.verify(token,secret,callbackfn)
        console.log('Token gerado:', token);
      }
}