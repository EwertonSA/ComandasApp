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
    create: async ({ pedidoId, valor, formaPagamento, status }: { 
        pedidoId: number; 
        valor: number; 
        formaPagamento: string; 
        status: string;
      }) => {
        const pedido = await Pedidos.findOne({
          where: { id: pedidoId },
          attributes: ["id", "comandaId", "total"],
        });
    
        if (!pedido) {
          throw new Error("Pedido não encontrado.");
        }
    
        if (!pedido.total || pedido.total <= 0) {
          throw new Error("O pedido não possui valor suficiente para pagamento.");
        }
    
        // Criar o pagamento com os campos obrigatórios
        const pagamento = await Pagamentos.create({
          pedidoId,
          valor,
          formaPagamento,
          status,
        });
    
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
    }

}