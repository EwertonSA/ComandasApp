import { Request, Response } from "express";
import { pedidosProdutosService } from "../services/pedidosProdutosService.js";
import { getPaginationParams } from "../helpers/getPaginationParams.js";

export const pedidosProdutosController = {
    index:async(req:Request,res:Response)=>{
        const [page,perPage]=getPaginationParams(req.query)
        try {
            const paginated=await pedidosProdutosService.findAllPaginated(page,perPage)
            return res.json(paginated)
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
    },
        getById:async(req:Request,res:Response)=>{
            const {id}=req.params
            try {
                const pedidoProduto=await pedidosProdutosService.getById(id)
                 if (!pedidoProduto) {
      return res.status(404).json({ error: "PedidoProduto não encontrado" });
    }
                return res.json(pedidoProduto)
            } catch (error:any) {
                console.error(error.message)
                return res.status(500).json({ error: error.message || "Erro interno do servidor." });
            }
        },
    save: async (req: Request, res: Response) => {
        try {
            const { pedidoId, produtoId, quantidade } = req.body;

            if (!pedidoId || !produtoId || !quantidade) {
                return res.status(400).json({ message: "Todos os campos são obrigatórios." });
            }

            const pedidosProdutos = await pedidosProdutosService.create({
                pedidoId: Number(pedidoId),
                produtoId: Number(produtoId),
                quantidade: Number(quantidade)
            });

            return res.status(201).json(pedidosProdutos);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ message: error.message });
            }
            return res.status(500).json({ message: "Erro desconhecido ao criar pedido-produto." });
        }
    },
    delete:async(req:Request,res:Response)=>{
        const {id}=req.params
        try {
            await pedidosProdutosService.delete(id)
            return res.status(204).send()
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
    }
};
