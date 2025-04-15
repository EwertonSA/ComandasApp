import { Clientes, Mesas } from "../models"
import { ClienteCreationAttributes } from "../models/Cliente"

export const clienteService={
    findAllPaginated:async(page:number,perPage:number)=>{
        const offset=(page - 1)*perPage
                const {rows,count}= await Clientes.findAndCountAll({
                    order:[['id','ASC']],
                    limit:perPage,
                    offset:offset
                })
                return {
                    clientes:rows,
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
},
create: async (attributes: ClienteCreationAttributes) => {
    const { mesaId } = attributes;

   
    const mesa = await Mesas.findOne({ where: { id: mesaId } });

   
    if (!mesa) {
        throw new Error("Mesa não encontrada");
    }

   
    const clientesNaMesa = await Clientes.count({ where: { mesaId } });

  
    if (clientesNaMesa >= mesa.capacidade) {
        throw new Error(`A mesa já atingiu sua capacidade máxima (${mesa.capacidade} pessoas).`);
    }

    const cliente = await Clientes.create(attributes);
    return cliente;
},


updateCliente:async(id:string,attributes:{nome:string,telefone:string,mesaId:number})=>{
const [affectedRows,updatedRows]=await Clientes.update(attributes,{
    where:{id},
    returning:true
})
return updatedRows[0]
},
deleteCliente:async(id:string,mesaId:number)=>{
   const del= await Clientes.destroy({where:{id,mesaId}})
   return del
}
}