import { Request, Response } from "express";
import { comandasService } from "../services/comandasService";

export const comandaController={
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
    }

}