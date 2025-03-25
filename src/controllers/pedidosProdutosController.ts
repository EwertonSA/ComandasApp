import { Request, Response } from "express";
import { pedidosProdutosService } from "../services/pedidosProdutosService";

export const pedidosProdutosController = {
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
    }
};
