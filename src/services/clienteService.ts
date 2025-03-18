import { Clientes } from "../models"

export const clienteService={
    findAllPaginated:async(page:number,perPage:number)=>{
        const offset=(page - 1)*perPage
                const {rows,count}= await Clientes.findAndCountAll({
                    order:[['id','ASC']],
                    limit:perPage,
                    offset:offset
                })
                return {
                    mesas:rows,
                    page:page,
                    perPage:perPage,
                    total:count
                }
    },
    clienteComanda:async(id:string)=>{
        const clienteComanda= await Clientes.findByPk(id,{
            attributes:['id','nome','telefone',['mesa_id','mesaId']],
            include:{
                association:'comandas',
                attributes:['id',['mesa_id','mesaId'],['cliente_id','clienteId']]
            }
        })
        return clienteComanda
}}