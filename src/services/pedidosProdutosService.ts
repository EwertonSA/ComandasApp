import PedidosProdutos, { PedidoProdutoAttributes } from "../models/pedidosProdutos.js";

export const pedidosProdutosService={
    findAllPaginated:async(page:number,perPage:number)=>{
        const offset=(page-1)*perPage
        const {rows,count}=await  PedidosProdutos.findAndCountAll({
            order:[['id','ASC']],
            limit:perPage,
            offset
        })
        return {
            pedidosProdutos:rows,
            page,
            limit:perPage,
            total:count
        }
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