import { ResourceOptions } from "adminjs";

const PedidosProdutosResourceOptions:ResourceOptions={
    navigation:"Comandas",
    showProperties:['pedido_id','produto_id','quantidade'],
    editProperties:['pedido_id','produto_id','quantidade'],
    listProperties:['produto_id','quantidade','createdAt','updatedAt'],
    filterProperties:['produto_id','quantidade','createdAt','updatedAt']
}
export default PedidosProdutosResourceOptions