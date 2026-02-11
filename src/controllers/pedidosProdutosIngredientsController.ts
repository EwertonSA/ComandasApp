import { Request, Response } from "express"
import { getPaginationParams } from "../helpers/getPaginationParams.js"
import { pedidosProdutosIngredientService } from "../services/pedidosProdutosIngredientService.js"

export const PedidosProdutosIngredientsController={
    index:async(req:Request,res:Response)=>{
        const [page,perPage]=getPaginationParams(req.query)
    try {
        const response=await pedidosProdutosIngredientService.findAllPaginated(page,perPage)
        return res.json(response)
    } catch (error:any) {
           console.error(error.message)
            return res.status(500).json({ error: error.message || "Erro interno do servidor." });
            
    }
    },
    showById:async(req:Request,res:Response)=>{
        const {id}=req.params
        try {
            const response=await pedidosProdutosIngredientService.getById(id)
            return res.json(response)
        } catch (error:any) {
               console.error(error.message)
            return res.status(500).json({ error: error.message || "Erro interno do servidor." });
        }

    },
   addIngredientsToPedidoProduto: async (req:Request, res:Response) => {
    const { pedidoProdutoId, ingredientes } = req.body;

    try {
      const created = await pedidosProdutosIngredientService.createMany(
        pedidoProdutoId,
        ingredientes
      );

      return res.status(201).json({
        message: "Ingredientes vinculados com sucesso!",
        data: created.map((item=>item.toJSON()))
      });
    } catch (error:any) {
       console.error(error.message)
            return res.status(500).json({ error: error.message || "Erro interno do servidor." });
    }
  }
    
}