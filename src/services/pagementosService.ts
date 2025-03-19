import Pagamentos, { PagamentoAttributes } from "../models/Pagamentos";

export const pagamentoService={
    create:async(attributes:PagamentoAttributes)=>{
        const pagamento= await Pagamentos.create(attributes)
        return pagamento
    }
}