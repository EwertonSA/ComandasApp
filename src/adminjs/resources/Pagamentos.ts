import { ResourceOptions } from "adminjs";
import { Pedidos } from "../../models";

const PagamentosResourceOptions:ResourceOptions={
    navigation:"Comanda",
    showProperties:['id','pedidoId','valor','formaPagamento','status'],
    editProperties:['pedidoId','valor','formaPagamento','status'],
    listProperties:['id','pedidoId','valor','formaPagamento','status'],
    filterProperties:['id','pedidoId','valor','formaPagamento','status'],
    
  actions: {
    new: {
      before: async (request) => {
        if (request.payload?.pedidoId) {
          const pedido = await Pedidos.findOne({
            where: { id: request.payload.pedidoId },
            attributes: ["total"],
          });

          if (pedido) {
            request.payload.valor = pedido.total; // Define automaticamente o valor
          }
        }
        return request;
      },
    },
}}
export default PagamentosResourceOptions