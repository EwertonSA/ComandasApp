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
                attributes:['id','nome',['mesa_id','mesaId']]
            }
        })
        return mesasClientes
    },
    create:async(attributes:MesasCreationAttributes)=>{
        const mesas= await Mesas.create(attributes)
        return mesas
    },
    update:async(id:string,attributes:{numero:number,capacidade:number})=>{
        const [affected,updatedMesas]= await Mesas.update(attributes,{
            where:{id},
            returning:true
        })
        return updatedMesas
    },
    delete:async(id:string)=>{
        const deleted=await Mesas.destroy({where:{id}})
        return deleted
    }
}