import { Pedidos } from "../models"
import { PedidoAttributes } from "../models/Pedidos"

export const pedidosService={
   findAllPaginated:async(page:number,perPage:number)=>{
    const offset=(page-1)*perPage
    const {rows,count}=await  Pedidos.findAndCountAll({
        order:[['id','ASC']],
        limit:perPage,
        offset:offset
    })
    return {
        pedidos:rows,
        page,
        perPage,
        count
    }
   },
   create:async(attributes:PedidoAttributes)=>{
    const pedido= await Pedidos.create(attributes)
    return pedido
   }
   
}