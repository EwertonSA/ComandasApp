import AdminJS, { PageHandler } from "adminjs"
import { Clientes, Comandas, Mesas, Pagamentos, Pedidos, PedidosProdutos, Produtos } from "../../models"

export const DashboarOptions:{
    handler?:PageHandler
    component?:string
}={
component:AdminJS.bundle('../component/dashboard.tsx'),
handler:async(req,res,context)=>{
    const mesas= await Mesas.count()
    const cliente=await Clientes.count()
    const comanda=await Comandas.count()
    const pedido=await Pedidos.count()
    const produto=await Produtos.count()
    const pedidoProduto=await PedidosProdutos.count()
    const pagamento=await Pagamentos.count()
    res.json(
        {
            "Mesas":mesas,
            "Cleintes":cliente,
            "Comandas":comanda,
            "Pedidos":pedido,
            "Produtos":produto,
            "PedidosProdutos":pedidoProduto,
            "Pagamento":pagamento
        }
    )
}
}