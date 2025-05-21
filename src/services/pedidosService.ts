
import { Pedidos, PedidosProdutos, Produtos } from "../models"
import { PedidoAttributes } from "../models/Pedidos"

export const pedidosService={
   getPedidos: async (page: number, perPage: number) => {
  const offset = (page - 1) * perPage;

  const { rows, count } = await Pedidos.findAndCountAll({
    order: [['id', 'DESC']],
    limit: perPage,
    offset,
   
  });

  return {
    pedidos: rows,
    page,
    perPage,
    total: count,
  };
},
 findAllPaginated: async (page: number, perPage: number) => {
  const offset = (page - 1) * perPage;

  const { rows, count } = await Pedidos.findAndCountAll({
    order: [['id', 'DESC']],
    limit: perPage,
    offset,
    include: [
      {
        association: 'produtos',
        attributes: ['id', 'nome', 'preco', 'thumbnailUrl'],
        through: { attributes: ['quantidade'] },
      },
    ],
  });

  return {
    pedidos: rows,
    page,
    perPage,
    total: count,
  };
},
   pedidoProduto: async (id: string) => {
    const pedido = await Pedidos.findByPk(id, {
      attributes: ["comandaId", "total", "status"],
      include: [
        {
          model: PedidosProdutos,
          as: "pedidosProdutos", // Deve ser o mesmo alias definido na associação!
          attributes: ["id", "pedidoId", "produtoId", "quantidade"],
          include: [
            {
              model: Produtos, // Inclui os detalhes do produto também
              as: "produto",
              attributes: ["nome", "preco",['thumbnail_url','thumbnailUrl']], // Pegue apenas os atributos necessários
            },
          ],
        },
      ],
    });
  
    return pedido;
  },
  
   create:async(attributes:PedidoAttributes)=>{
    const pedido= await Pedidos.create(attributes)
    return pedido
   },
   update:async(id:string,attibutes:{comandaId:number,total:number,status:string})=>{
    const updated=await Pedidos.update(attibutes,{where:{id}})
    return updated
},
delete:async(id:string)=>{
  const deleted=await Pedidos.destroy({where:{id}})
  return deleted
}
   
}