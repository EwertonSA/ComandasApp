import { Request, Response } from "express"
import { userService } from "../services/userService"
import { jwtService } from "../services/jwtService"

export const authController={
    register: async (req: Request, res: Response) => {
        const { name, phone, email, password, role } = req.body;
      
        // Defina os tipos de roles permitidos
        const allowedRoles = ["user", "cliente", "admin"];
      
        try {
          // Verifica se o email já existe
          const alreadyExists = await userService.findByEmail(email);
          if (alreadyExists) {
            throw new Error("Email já cadastrado.");
          }
      
          // Verifica se a role enviada é válida
          const finalRole = allowedRoles.includes(role) ? role : "user";
      
          // Cria o usuário com a role correta
          const user = await userService.create({
            name,
            phone,
            email,
            password,
            role: finalRole,
          });
      
          return res.status(201).json(user);
        } catch (error) {
          if (error instanceof Error) {
            return res.status(400).json({ message: error.message });
          }
        }
      },
      
    login:async(req:Request,res:Response)=>{
        const{email,password}=req.body
        try {
        const user= await userService.findByEmail(email)
        if(!user) return res.status(404).json({message:'E-mail não registrado'})
        user.checkPassword(password,(err,isSame)=>{
        if(err) return res.status(400).json({message:err.message})
        if(!isSame)return res.status(401).json({message:"Senha incorreta!"})
        const payload={
                   id:user.id,email:user.email     
                }
                const token= jwtService.signToken(payload,'7d')
                return res.json({authenticated:true,...payload,token})
                })
                } catch (error) {
                    if(error instanceof Error){
                        return res.status(400).json({message:error.message})
                    }
                }
            }
      
      
}
