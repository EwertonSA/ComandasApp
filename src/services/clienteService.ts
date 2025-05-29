import { Op } from "sequelize";
import { Clientes } from "../models/Cliente.js"
import Comandas from "../models/Comandas.js"
import {Mesas} from "../models/Mesas.js"
import { ClienteCreationAttributes } from "../models/Cliente.js"

export const clienteService={
  findPaginated: async (page: number, perPage: number) => {
  const offset = (page - 1) * perPage;


  const { count, rows } = await Clientes.findAndCountAll({
    offset,
    limit: perPage,
    order: [['createdAt', 'ASC']],
  });

  return {
    clientes: rows,
    page,
    perPage,
    total: count,
  };
}
,
findAllPaginated: async (page: number, perPage: number, status?: string) => {
  const offset = (page - 1) * perPage;
  const normalizedStatus = status?.toLowerCase().trim();

  const whereComanda = normalizedStatus ? { status: normalizedStatus } : {};

  const { count, rows } = await Clientes.findAndCountAll({
    offset,
    limit: perPage,
    include: [
      {
        model: Comandas,
        as: 'comandas',
        where: whereComanda,
        required: true,
      },
    ],
    order: [['createdAt', 'ASC']],
  });

  return {
    clientes: rows,
    page,
    perPage,
    total: count,
  };
}
,

    clienteComanda:async(id:string)=>{
        const clienteComanda= await Clientes.findByPk(id,{
            attributes:['id','nome',['mesa_id','mesaId']],
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


updateCliente:async(id:string,attributes:{nome:string,mesaId:number})=>{
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