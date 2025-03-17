import { ResourceOptions } from "adminjs";

const PedidosProdutosResourceOptions:ResourceOptions={
    navigation:"Comandas",
    showProperties:['pedidoId','produtoId','quantidade'],
    editProperties:['pedidoId','produtoId','quantidade'],
    listProperties:['produtoId','quantidade','createdAt','updatedAt'],
    filterProperties:['produtoId','quantidade','createdAt','updatedAt']
}
export default PedidosProdutosResourceOptions