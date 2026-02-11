import { Request, Response } from "express";
import { IngredientService } from "../services/ingredientService.js";
import { getPaginationParams } from "../helpers/getPaginationParams.js";
import { Ingredients } from "../models/ingredients_temp.js";

export const IngredientsController={
    index:async(req:Request,res:Response)=>{
        const [page,perPage]=getPaginationParams(req.query)
        try {
            
            const ingredient=await IngredientService.findAllPaginated(page,perPage)
            return res.json(ingredient)
        } catch (error:any) {
            console.error(error.message)
            return res.status(500).json({ error: error.message || "Erro interno do servidor." });
        }
    },
    showById:async(req:Request,res:Response)=>{
        try {        
            const {id}=req.params
            console.log("IdNoController:",id)
            const ingredient= await IngredientService.findById(id) 
            console.log('IngredientNoController:',ingredient)
            return res.json(ingredient)
        } catch (error:any) {
              console.error(error.message)
            return res.status(500).json({ error: error.message || "Erro interno do servidor." });
        }

    },
    save:async(req:Request,res:Response)=>{
        try {
            const {name}=req.body
         
            const ingredient=await IngredientService.create({name})
         
            return res.json(ingredient)
        } catch (error:any) {
               console.error(error.message)
            return res.status(500).json({ error: error.message || "Erro interno do servidor." });
        }
    }
}