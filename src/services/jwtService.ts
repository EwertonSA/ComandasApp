import { Request, Response } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import { userService } from './userService'
const scret='chave'
export const jwtService={
    signToken:async(payload:string  | object |Buffer, expiration:string)=>{
return jwt.sign(payload,scret,{
    expiresIn:expiration 
 } as SignOptions) 
},
}