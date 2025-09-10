import { NextFunction, Request, Response } from "express";
import { getPaginationParams } from "../helpers/getPaginationParams.js";
import { clienteService } from "../services/clienteService.js";
import { userService } from "../services/userService.js";
import Comandas from "../models/Comandas.js";
import { jwtService } from "../services/jwtService.js";
import { JwtPayload } from "jsonwebtoken";



export const clientesController={
        index1:async(req:Request,res:Response)=>{
        const [page,perPage]=getPaginationParams(req.query)

        try {
            const paginatedClientes= await clienteService.findPaginated(page,perPage)
            return res.json(paginatedClientes)
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
    },
    index:async(req:Request,res:Response)=>{
        const [page,perPage]=getPaginationParams(req.query)
       const status = req.query.status?.toString();
        try {
            const paginatedClientes= await clienteService.findAllPaginated(page,perPage,status)
            return res.json(paginatedClientes)
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
    },
    showUser:async(req:Request,res:Response)=>{
        const {id}=req.params
        try {
            const user=await userService.findByEmail(id)
            return res.json(user)
        } catch (error) {
           if(error instanceof Error){
            return res.status(400).json({message:error.message})
        }  
        }
    },
    show:async(req:Request,res:Response)=>{
        const {id}=req.params
       try {
        const comandas= await clienteService.clienteComanda(id)
        return res.json(comandas)
       } catch (error) {
        if(error instanceof Error){
            return res.status(400).json({message:error.message})
        }
       }
    },
    registro:async(req:Request,res:Response)=>{
        const {nome,telefone,mesaId}=req.body
        const mesaIdNumber = Number(mesaId); // Converte para número

if (isNaN(mesaIdNumber)) {
    return res.status(400).json({ message: "mesaId deve ser um número válido" });
}
        try {
            const cliente= await clienteService.create({
                nome,mesaId:mesaIdNumber
            })
            return res.status(201).json(cliente)
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            } 
        }
    },
register: async (req: Request, res: Response) => {
  const { nome, mesaId } = req.body;
  const mesaIdNumber = Number(mesaId);
  if (isNaN(mesaIdNumber)) return res.status(400).json({ message: "mesaId inválido" });

  try {
    const cliente = await clienteService.create({ nome, mesaId: mesaIdNumber });

    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: "Não autenticado" });

    const token = authHeader.split(' ')[1];
    const payload = jwtService.verifyTokenState<JwtPayload>(token);

    // Remove exp e iat para poder gerar novo token
    const { exp, iat, ...cleanPayload } = payload;

    const newPayload = { ...cleanPayload, clienteId: cliente.id, mesaId: mesaIdNumber };
    const newToken = jwtService.signToken(newPayload, "7d");

    return res.status(201).json({ cliente, token: newToken });
  } catch (error) {
    return res.status(400).json({ message: error instanceof Error ? error.message : "Erro" });
  }
}

,

    update:async(req:Request,res:Response)=>{
        const id=req.params.id
        const {nome,telefone,mesaId}=req.body
        try {
            const update= await clienteService.updateCliente(id,{
                nome,mesaId
            })
            return res.status(201).json(update)
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            } 
        } 
    },
    delete:async(req:Request,res:Response)=>{
       const {id,mesaId}=req.params
       try {
        await clienteService.deleteCliente(id,Number(mesaId))
        return res.status(204).send()
       } catch (error) {
        if(error instanceof Error){
            return res.status(400).json({message:error.message})
        } 
       }
    }

}