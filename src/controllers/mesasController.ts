import { Request, Response } from "express";
import { mesasService } from "../services/mesasService";
import { getPaginationParams } from "../helpers/getPaginationParams";

export const mesasController={
    
    index: async(req:Request,res:Response)=>{
      const [page,perPage]=getPaginationParams(req.query)
        try {
            const paginatedMesas=await mesasService.findAllPaginated(page,perPage)
            return res.json(paginatedMesas )
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
     
      
    },
    show:async(req:Request,res:Response)=>{
       const {id}=req.params
       try {
        const clientes=await mesasService.finByIdWithClientes(id)
        return res.json(clientes)
       } catch (error) {
        if(error instanceof Error){
            return res.status(400).json({message:error.message})
        }
       } 
    },
    save:async(req:Request,res:Response)=>{
        const {numero,capacidade}=req.body
        try {
            const mesa= await mesasService.create({
                numero,capacidade
            })
            return res.status(200).json(mesa)
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
    },
    update:async(req:Request,res:Response)=>{
        const {id}=req.params
        const {numero,capacidade}=req.body
        try {
            const updated=await mesasService.update(id,{
                numero,capacidade}
            )
            return res.status(204).send()
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            } 
        }
    },
    delete:async(req:Request,res:Response)=>{
        const {id}=req.params
        try {
           await mesasService.delete(id)
            return res.status(204).send()
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            } 
        }
    }
}