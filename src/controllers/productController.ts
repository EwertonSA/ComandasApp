import { Request, Response } from "express";
import { getPaginationParams } from "../helpers/getPaginationParams.js";
import { produtoService } from "../services/produtosService.js";

import { Op } from "sequelize";
import Produtos from "../models/Produtos.js";

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
    },
    findByName:async(req:Request,res:Response)=>{
        const {nome}=req.query
        const [page,perPAge]=getPaginationParams(req.query)
        try {
            if(typeof nome !== 'string') throw new Error('Must be of type string')
            const product=await produtoService.search(nome,page,perPAge)
        return res.json(product)
       
        } catch (error) {
            
                if(error instanceof Error){
                    return res.status(400).json({message:error.message})
                }
            }
    },
    save:async(req:Request,res:Response)=>{
        const {nome,descricao,preco,categoria,thumbnailUrl}=req.body
        try {
            const produto=await produtoService.create({
                nome,descricao,preco,categoria,thumbnailUrl
            })
            return res.status(200).json(produto)
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
    },
 
    update:async(req:Request,res:Response)=>{
        const {id}=req.params
        const {nome,descricao,preco,categoria,thumbnailUrl}=req.body
        try {
            const updated=await produtoService.update(id,{nome,descricao,preco,categoria,thumbnailUrl})
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
            const deleted=await produtoService.delete(id)
            return res.status(204).send()
        } catch (error) {
            if(error instanceof Error){
                return res.status(400).json({message:error.message})
            }
        }
    },
    getAllGroupedByCategory: async (req: Request, res: Response) => {
        try {
          const categorias = ["Entradas", "Pratos", "Bebidas", "Sobremesas"];
          const resultado: any = {};
      
          for (const categoria of categorias) {
            const produtos = await Produtos.findAll({
              where: {
                categoria: {
                  [Op.iLike]: categoria
                }
              }
            });
            resultado[categoria] = produtos;
          }
      
          return res.json(resultado);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: "Erro ao buscar produtos" });
        }
      } ,  getById:async(req:Request,res:Response)=>{
        console.log('Entrou em getById');
       const {id}=req.params
       try {
        const produto=await produtoService.show(id)
        console.log(JSON.stringify(produto, null, 2)) 
        return res.json(produto)
       } catch (error) {
        if(error instanceof Error){
            return res.status(400).json({message:error.message})
        }
       }
    },
      
    }
