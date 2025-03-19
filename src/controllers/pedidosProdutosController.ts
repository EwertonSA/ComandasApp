import { Request, Response } from "express";
import { pedidosProdutosService } from "../services/pedidosProdutosService";

export const pedidosProdutosController={
    save:async(req:Request,res:Response)=>{
        const {pedido_id,produto_id,quantidade}=req.body
        try {
            const pedidosProdutos=await pedidosProdutosService.create({
                pedido_id,produto_id,quantidade
            })
            return res.status(200).json(pedidosProdutos)
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
    }
}