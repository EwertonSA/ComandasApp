

import  PedidosProdutos from "../models/pedidosProdutos.js";
import Pedidos, { PedidoAttributes } from "../models/Pedidos.js"
import  Produtos  from "../models/Produtos.js";
import { PedidosProdutosIngredients } from "../models/PedidosProdutosIngredients.js";
import { Ingredients } from "../models/ingredients_temp.js";

export const pedidosService={
   getPedidos: async (page: number, perPage: number) => {
  const offset = (page - 1) * perPage;

  const { rows, count } = await Pedidos.findAndCountAll({
    order: [['id', 'DESC']],
    include:[
      {association:'pedidosProdutos',
        attributes:['id'],
        include:[
          {association:'produto',attributes:['nome']},
          {association:'pedidosProdutosIngredients',attributes:['ingredientId'],
            include:[
              {association:'ingredient',attributes:['id','name']}
            ]
          },
        ]
      }
    ],
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
      as: 'pedidosProdutos',
      include: [
        {
          model: Produtos,
          as: 'produto',
        },
        {
          model: PedidosProdutosIngredients,
          as: 'pedidosProdutosIngredients',
          include: [
            {
              model: Ingredients,
              as: 'ingredient', 
            },
          ],
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