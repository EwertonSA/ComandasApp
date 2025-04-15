import { Clientes, Comandas } from "../models"
import { ComandaAttributes } from "../models/Comandas"

export const comandasService={
findAllPaginated:async(page:number,perPage:number)=>{
    const offset=(page-1)*perPage
    const {rows,count}=await Comandas.findAndCountAll({
        order:[['id','ASC']],
        limit:perPage,
        offset
    })
    return {
        comandas:rows,
        page,
        perPage,
        total:count
    }
},

    ComandaPedido:async(id:string)=>{
        const comandaPedido=await Comandas.findByPk(id,{
            attributes:['id', ['mesa_id','mesaId'],['cliente_id','clienteId']],
            include:{
                association:'pedidos',
                attributes:['id',['comanda_id','comandaId'],'total','status']
            }
        })
        return comandaPedido
    },
    create:async(attibutes:{mesaId:number,clienteId:number})=>{
        const {mesaId,clienteId}=attibutes
        const comandaExiste=await Comandas.findOne({where:{clienteId}})
        if(comandaExiste){
            throw new Error("Esse cliente já possui comanda aberta.")
        }
        const cliente=await Clientes.findByPk(clienteId)
        if(!cliente){
            throw new Error("O cliente não existe!")
        }
        console.log("ℹ️ Tipo de cliente.mesaId:", typeof cliente.mesaId, cliente.mesaId);
console.log("ℹ️ Tipo de mesaId recebido:", typeof mesaId, mesaId);

        if(cliente.mesaId !== Number(mesaId)){
            throw new Error("Esse cliente não pertence a essa mesa")
        }
        const comanda=await Comandas.create(attibutes)
        return comanda
    },
    update:async(id:string,attributes:{mesaId:number,clienteId:number})=>{
        const [affected,updated]= await Comandas.update(attributes,{
            where:{id},
            returning:true

        })
        return updated[0]
    },
    delete:async(id:string)=>{
        const deleted=await Comandas.destroy({where:{id}})
        return deleted
    }
}