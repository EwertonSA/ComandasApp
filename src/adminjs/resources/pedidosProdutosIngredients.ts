import { ResourceOptions } from "adminjs";

export const PedidosProdutosIngredientsResourceOptions:ResourceOptions={
    navigation:"Comandas",
    filterProperties:['id','pedidoProdutoId','ingredientId','include'],
    showProperties:['id','pedidoProdutoId','ingredientId','include'],
    editProperties:['pedidoProdutoId','ingredientId','include'],
    listProperties:['id','pedidoProdutoId','ingredientId','include'],
     properties: {
    pedidoProdutoId: {
      reference: "pedidosProdutos",
      isVisible: { list: true, filter: true, show: true, edit: true },
    
    },
    ingredientId: {
      reference: "ingredients",
      isVisible: { list: true, filter: true, show: true, edit: true },
      
    },
  include: {
  type: "boolean",
  availableValues: [
    { value: "true", label: "Sim" },
    { value: "false", label: "Não" },
  ],
}
}}