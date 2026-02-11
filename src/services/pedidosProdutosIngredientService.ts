import { PedidosProdutosIngredients, PedidosProdutosIngredientsCreationAttributes } from "../models/PedidosProdutosIngredients.js"

export const pedidosProdutosIngredientService={
    findAllPaginated:async(page:number,perPage:number)=>{
        const offset=(page-1)*perPage
        const {rows,count}=await PedidosProdutosIngredients.findAndCountAll({
            order:[['id','ASC']],
            limit:perPage,
            offset:offset
        })
        return{
              pedidosProdutosIngredients:rows,
            page,
            limit:perPage,
            total:count
        }
    },
       getById:async(id:string)=>{
            const res=await PedidosProdutosIngredients.findByPk(id,{
                attributes:['id','pedidoProdutoId','ingredientId','include'],
                 include: [
    { association: 'pedidosProdutos' },
    { association: 'ingredient' }
  ]

            })
            return res
        },
        createMany: async (
    pedidoProdutoId: number,
    ingredientes: { ingredientId: number; include: boolean }[]
  ) => {
    const ingredientesArray = Array.isArray(ingredientes)
  ? ingredientes
  : [ingredientes];
    const registros: PedidosProdutosIngredientsCreationAttributes[] = ingredientesArray.map(
      (i) => ({
        pedidoProdutoId,
        ingredientId: i.ingredientId,
        include: i.include
      })
    );

    const res = await PedidosProdutosIngredients.bulkCreate(registros);
    return res;
  },
    create:async(attributes:PedidosProdutosIngredientsCreationAttributes)=>{
const res=await PedidosProdutosIngredients.create(attributes)
return res
    }
}