import { Request, Response } from "express";
import { getPaginationParams } from "../helpers/getPaginationParams";
import { produtoService } from "../services/produtosService";

export const productController={
    index:async(req:Request,res:Response)=>{
        const [page,perPage]=getPaginationParams(req.query)
        try {
            const produtos= await produtoService.finadAllPaginated(page,perPage)
            return res.json(produtos)

        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
    }
}