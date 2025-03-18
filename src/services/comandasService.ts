import { Comandas } from "../models"

export const comandasService={
    ComandaPedido:async(id:string)=>{
        const comandaPedido=await Comandas.findByPk(id,{
            attributes:['id', ['mesa_id','mesaId'],['cliente_id','clienteId']],
            include:{
                association:'pedidos',
                attributes:['id',['comanda_id','comandaId'],'total','status']
            }
        })
        return comandaPedido
    }
}