import jwt, { SignOptions } from 'jsonwebtoken'

const secret='chave'
export const jwtService={
   
    signToken: (payload: string | object | Buffer, expiration: string): string => {
        return jwt.sign(payload, secret, { expiresIn: expiration } as SignOptions)
      },
      verifyToken:(token:string,callbackfn:jwt.VerifyCallback)=>{
        jwt.verify(token,secret,callbackfn)
      }
}