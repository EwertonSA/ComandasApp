import { Request, Response } from "express";
import { pagamentoService } from "../services/pagementosService";
import { getPaginationParams } from "../helpers/getPaginationParams";

export const pagamentoController={
    index:async(req:Request,res:Response)=>{
        const [page,perPage]=getPaginationParams(req.query)
        try {
            const paginated=await pagamentoService.findAllPaginated(page,perPage)
            return res.json(paginated)
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
    },
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
      
    },
    show:async(req:Request,res:Response)=>{
        const {id}=req.params
        try {
            const pagamento=await pagamentoService.show(id)
            return res.json(pagamento)
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
    }
}
