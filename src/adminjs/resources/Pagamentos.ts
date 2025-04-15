import { ResourceOptions } from "adminjs";
import { Pagamentos, Pedidos } from "../../models";

const PagamentosResourceOptions:ResourceOptions={
    navigation:"Comanda",
    showProperties:['id','comandaId','valor','formaPagamento','status'],
    editProperties:['comandaId','valor','formaPagamento','status'],
    listProperties:['id','comandaId','valor','formaPagamento','status'],
    filterProperties:['id','comandaId','valor','formaPagamento','status'],
    
  actions: {
    new: {
      before: async (request) => {
        if (request.payload?.pedidoId) {
          const pedido = await Pedidos.findOne({
            where: { id: request.payload.pedidoId },
            attributes: ["total", "status"],
          });
    
          if (!pedido) {
            throw new Error("Pedido não encontrado.");
          }
    
          const totalPedido = Number(pedido.total);
    
          const pagamentosExistentes = await Pagamentos.findAll({
            where: { comandaId: request.payload.pedidoId },
            attributes: ["valor"],
          });
    
          const totalPago = pagamentosExistentes.reduce(
            (sum, pagamento) => sum + Number(pagamento.valor),
            0
          );
    
          const totalRestante = totalPedido - totalPago;
    
          console.log(`Total do pedido: ${totalPedido}`);
          console.log(`Total já pago: ${totalPago}`);
          console.log(`Total restante: ${totalRestante}`);
    
          if (totalRestante <= 0) {
            throw new Error("Este pedido já foi totalmente pago.");
          }
    
          const valorDigitado = Number(request.payload.valor);
    
          if (valorDigitado > totalRestante) {
            throw new Error(
              `O valor inserido ultrapassa o total restante de R$ ${totalRestante.toFixed(2)}`
            );
          }
    
          
          if (valorDigitado === totalRestante) {
            await Pedidos.update(
              { status: "pago" },
              { where: { id: request.payload.pedidoId } }
            );
            console.log("Pedido atualizado para 'pago'.");
          }
    
          return request;
        }
        return request;
      },
    }
    
    
}}
export default PagamentosResourceOptions