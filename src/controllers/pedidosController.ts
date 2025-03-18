import { Request, Response } from "express";
import { getPaginationParams } from "../helpers/getPaginationParams";
import { pedidosService } from "../services/pedidosService";

export const pedidosController={
   index:async(req:Request,res:Response)=>{
    const [page,perPage]=getPaginationParams(req.query)
    try {
        const paginatedPedidos= await pedidosService.findAllPaginated(page,perPage)
        return res.json(paginatedPedidos)
    } catch (error) {
        if(error instanceof Error){
            return res.status(400).json({message:error.message})
        }
    }
   },
   save:async(req:Request,res:Response)=>{
    const {comandaId,total,status}=req.body
    try {
        const pedido=await pedidosService.create({
            comandaId,total,status
        })
        return res.status(200).json(pedido)
    } catch (error) {
        if(error instanceof Error){
            return res.status(400).json({message:error.message})
        }
    }
   }
}