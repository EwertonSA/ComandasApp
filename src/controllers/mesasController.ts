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
     
      
    }
}