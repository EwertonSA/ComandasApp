import PedidosProdutos, { PedidoProdutoAttributes } from "../models/pedidosProdutos";

export const pedidosProdutosService={
    create:async(attributes:PedidoProdutoAttributes)=>{
        const pedidosProdutos= await PedidosProdutos.create(attributes)
        return pedidosProdutos
    },
}