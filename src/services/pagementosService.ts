import { Sequelize } from "sequelize";
import { Pedidos } from "../models";
import Pagamentos, { PagamentoAttributes } from "../models/Pagamentos";

export const pagamentoService={
    findAllPaginated:async(page:number,perPage:number)=>{
        const offset= (page-1)*perPage
        const {rows,count}=await Pagamentos.findAndCountAll({
            order:[['id','ASC']],
            limit:perPage,
            offset
        })
        return{
            pagamentos:rows,
            page,
            limit:perPage,
            total:count
        }
    },
  

    criarPagamento:async (pedidoId: number, valor: number, formaPagamento: string, status: string) => {
      const pedido = await Pedidos.findOne({
        where: { id: pedidoId },
        attributes: ["total", "status"],
      });
    
      if (!pedido) {
        throw new Error("Pedido não encontrado.");
      }
    
      const totalPedido = Number(pedido.total);
    
      const pagamentosExistentes = await Pagamentos.findAll({
        where: { pedidoId },
        attributes: ["valor"],
      });
    
      const totalPago = pagamentosExistentes.reduce(
        (sum, pagamento) => sum + Number(pagamento.valor),
        0
      );
    
      const totalRestante = totalPedido - totalPago;
    
      if (totalRestante <= 0) {
        throw new Error("Este pedido já foi totalmente pago.");
      }
    
      const valorDigitado = Number(valor);
    
      if (valorDigitado > totalRestante) {
        throw new Error(`O valor inserido ultrapassa o total restante de R$ ${totalRestante.toFixed(2)}`);
      }
    
  
      const pagamento = await Pagamentos.create({
        pedidoId,
        valor: valorDigitado,
        formaPagamento,
        status,
      });
    
    
      if (valorDigitado === totalRestante) {
        await Pedidos.update({ status: "pago" }, { where: { id: pedidoId } });
      }
    
      return pagamento;
    },
    
    
    show:async(id:string)=>{
        const pagamento= await Pagamentos.findByPk(id,{
            attributes:['id','pedidoId','produtoId','quantidade'],
            include:{
                association:'pedidos',
                attributes:['id','comandaId','total','status']
            }
        })
        return pagamento
    },
    update:async(id:string, attributes:{pedidoId:number,valor:number,formaPagamento:string,status:string})=>{
    
      const [affected,updated]=await Pagamentos.update(attributes,{
        where:{id},
        returning:true
      })
      return updated
    },
    delete:async(id:string)=>{
      const deleted=await Pagamentos.destroy({where:{id}})
      return deleted
    }

}