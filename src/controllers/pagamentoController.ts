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
  create:async (req: Request, res: Response) => {
      const { comandaId, valor, formaPagamento} = req.body;
    
      try {
        const pagamento = await pagamentoService.criarPagamento(comandaId, valor, formaPagamento);
        return res.status(201).json(pagamento);
      } catch (error) {
        if (error instanceof Error) {
          return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Erro interno no servidor." });
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
    },
    update:async(req:Request,res:Response)=>{
        const {id}=req.params
        const {comandaId,valor,formaPagamento}=req.body
        try {
            const update=await pagamentoService.update(id,{comandaId,valor,formaPagamento,status:'pendente'})
            return res.json(update)
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
    },
    delete:async(req:Request,res:Response)=>{
    const {id}=req.params
    try {
        await pagamentoService.delete(id)
        return res.status(204).send()
    } catch (error) {
        if(error instanceof Error){
            return res.status(400).json({message:error.message})
        }
    }
    },
    total:async(req:Request,res:Response)=>{
try {
    const total=await pagamentoService.totalPagamentos()
    return res.json(total)
} catch (error) {
    if(error instanceof Error){
        return res.status(400).json({message:error.message})
    }
}
    }
}
