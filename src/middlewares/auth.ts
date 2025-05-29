import { NextFunction, Request, Response } from "express"
import { jwtService } from "../services/jwtService.js"
import { userService } from "../services/userService.js"
import { JwtPayload } from "jsonwebtoken"
import { UserInstance } from "../models/User.js"

export interface AuthenticatedRequest extends Request{
    user?:UserInstance|null
}

export function ensureAuth(req:AuthenticatedRequest,res:Response,next:NextFunction){
const header=req.headers.authorization
if(!header) return res.status(401).json({
    message:"Nao autorizado"
})
const token=header.replace("Bearer ","")
jwtService.verifyToken(token,(err,decoded)=>{
if(err ||typeof decoded === "undefined") return res.status(401).json({
    message:"Não autorizado: token inválido."
})
userService.findByEmail((decoded as JwtPayload).email).then(user=>{
    req.user=user
    next()
})
})

}
export default ensureAuth
