import { Request, Response } from "express";
import { pagamentoService } from "../services/pagementosService";

export const pagamentoController={
 
    save:async(req:Request,res:Response)=>{
        const {pedidoId,valor,formaPagamento,status}=req.body
        try {
            const pagamento=await pagamentoService.create({
                pedidoId,valor,formaPagamento,status
            })
            return res.status(200).json(pagamento)
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
      
    }
}
