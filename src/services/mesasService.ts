import { Mesas } from "../models"
import { MesasCreationAttributes } from "../models/Mesas"

export const mesasService={
    findAllPaginated: async(page:number,perPage:number)=>{
        const offset=(page - 1)*perPage
        const {rows,count}= await Mesas.findAndCountAll({
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
    finByIdWithClientes: async(id:string)=>{
        const mesasClientes=await Mesas.findByPk(id, {
            attributes:['id','numero','capacidade'],
            include:{
                association:'clientes',
                attributes:['id','nome','telefone',['mesa_id','mesaId']]
            }
        })
        return mesasClientes
    },
    create:async(attributes:MesasCreationAttributes)=>{
        const mesas= await Mesas.create(attributes)
        return mesas
    }
}