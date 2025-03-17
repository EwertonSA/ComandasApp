import { ResourceOptions } from "adminjs";

const PagamentosResourceOptions:ResourceOptions={
    navigation:"Comanda",
    showProperties:['id','pedidoId','valor','formaPagamento','status'],
    editProperties:['id','pedidoId','valor','formaPagamento','status'],
    listProperties:['id','pedidoId','valor','formaPagamento','status'],
    filterProperties:['id','pedidoId','valor','formaPagamento','status']
}
export default PagamentosResourceOptions