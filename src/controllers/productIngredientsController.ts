import { Request, Response } from "express";
import { getPaginationParams } from "../helpers/getPaginationParams.js";
import { ProductsIngredientsService } from "../services/productIngridientsService.js";

export const ProductIngredientsController={
    index:async(req:Request,res:Response)=>{
        const [page,perPage]=getPaginationParams(req.query)
        try {
            const response= await ProductsIngredientsService.findAllPaginated(page,perPage)
            return res.json(response)
        } catch (error:any) {
              console.error(error.message)
            return res.status(500).json({ error: error.message || "Erro interno do servidor." });
        }
    },
    create:async(req:Request,res:Response)=>{
        const {productId,ingredientId,optional}=req.body
        try {
            const response=await ProductsIngredientsService.create({productId,ingredientId,optional})
            return res.json(response)
        } catch (error:any) {
              console.error(error.message)
            return res.status(500).json({ error: error.message || "Erro interno do servidor." });
            
        }
    }
}