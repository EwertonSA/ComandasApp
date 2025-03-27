import { Request, Response } from "express";
import { comandasService } from "../services/comandasService";
import { getPaginationParams } from "../helpers/getPaginationParams";

export const comandaController={
    index:async(req:Request,res:Response)=>{
        const [page,perPage]=getPaginationParams(req.query)
        try {
            const paginated=await comandasService.findAllPaginated(page,perPage)
            return res.json(paginated)
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }   
        }
    },
    show:async(req:Request,res:Response)=>{
        const {id}=req.params
        try {
            const comandaPedido= await comandasService.ComandaPedido(id)
            return res.json(comandaPedido)
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
    },
    save:async(req:Request,res:Response)=>{
        const{mesaId,clienteId}=req.body
        try {
            const comanda= await comandasService.create({
                mesaId,clienteId
            })
            return res.status(200).json(comanda)
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
    },
    update:async(req:Request,res:Response)=>{
        const {id}=req.params
        const {mesaId,clienteId}=req.body
        try {
            await comandasService.update(id,{mesaId,clienteId})
            return res.status(204).send
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
    },
    delete:async(req:Request,res:Response)=>{
        const {id}=req.params
        try {
           await comandasService.delete(id) 
            return res.status(204).send()
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
    }

}