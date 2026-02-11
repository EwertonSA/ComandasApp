import { Ingredients } from "../models/ingredients_temp.js";
import PedidosProdutos, { PedidoProdutoAttributes } from "../models/pedidosProdutos.js";
import { PedidosProdutosIngredients } from "../models/PedidosProdutosIngredients.js";
import Produtos from "../models/Produtos.js";

export const pedidosProdutosService={
    findAllPaginated:async(page:number,perPage:number)=>{
        const offset=(page-1)*perPage
        const {rows,count}=await  PedidosProdutos.findAndCountAll({
            order:[['id','ASC']],
            include:[
                {model:Produtos, as: 'produto'},
                {
                    model:PedidosProdutosIngredients, as:'pedidosProdutosIngredients',
                    include:[{model:Ingredients, as:'ingredient'}]
                }
            ],

            limit:perPage,
            offset,
        })
        return {
            pedidosProdutos:rows,
            page,
            limit:perPage,
            total:count
        }
    },
    getById:async(id:string)=>{
        const res=await PedidosProdutos.findByPk(id,{
            include:[
                {association:"pedidosProdutosIngredients"},

            ]
        })
        return res
    },
    create:async(attributes:PedidoProdutoAttributes)=>{
        const pedidosProdutos= await PedidosProdutos.create(attributes)
        return pedidosProdutos
    },
    delete:async(id:string)=>{
        const deleted=await PedidosProdutos.destroy({where:{id}})
        return deleted
    }
}