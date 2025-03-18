import { Request, Response } from "express";
import { getPaginationParams } from "../helpers/getPaginationParams";
import { clienteService } from "../services/clienteService";

export const clientesController={
    index:async(req:Request,res:Response)=>{
        const [page,perPage]=getPaginationParams(req.query)
        try {
            const paginatedClientes= await clienteService.findAllPaginated(page,perPage)
            return res.json(paginatedClientes)
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
    }
}