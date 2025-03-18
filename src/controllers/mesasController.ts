import { Request, Response } from "express";
import { Mesas } from "../models";

export const mesasController={
    index: async(req:Request,res:Response)=>{
        try {
            const mesas= await Mesas.findAll({
                order:[['id','ASC']]
            })
            return res.json(mesas)
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
     
      
    }
}