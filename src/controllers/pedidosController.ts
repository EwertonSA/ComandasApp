import { Request, Response } from "express";
import { getPaginationParams } from "../helpers/getPaginationParams";
import { pedidosService } from "../services/pedidosService";
import { PedidosProdutos } from "../models";

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
   show:async(req:Request,res:Response)=>{
    const {id}=req.params
    try {
        const pedido=await pedidosService.pedidoProduto(id)
        return res.json(pedido)
    } catch (error) {
        if(error instanceof Error){
            return res.status(400).json({message:error.message})
        }
    }
   },
 
   save:async(req:Request,res:Response)=>{
    const {comandaId,total}=req.body
    try {
        const pedido=await pedidosService.create({
            comandaId,total, status: "pendente",
        })
        return res.status(200).json(pedido)
    } catch (error) {
        if(error instanceof Error){
            return res.status(400).json({message:error.message})
        }
    }
   },update:async(req:Request,res:Response)=>{
    const {id}=req.params
    const {comandaId,total,status}=req.body
    try {
        await pedidosService.update(id,{comandaId,total,status})
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
        await pedidosService.delete(id)
        return res.status(204).send()
    } catch (error) {
        if(error instanceof Error){
            return res.status(400).json({message:error.message})
        }
    }
   }
}