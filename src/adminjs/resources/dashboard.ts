import AdminJS, { ComponentLoader, PageHandler } from "adminjs";
import { Clientes, Comandas, Mesas, Pagamentos, Pedidos, PedidosProdutos, Produtos } from "../../models";
import path from "path";
export const componentLoader = new ComponentLoader();
componentLoader.add('Dashboard', path.join(process.cwd(), 'src', 'adminjs', 'component', 'dashboard.tsx'));

export const DashboarOptions = {
  component: 'Dashboard',
  handler: async (req:any, res:any, context:any) => {
    const mesas = await Mesas.count();
    const cliente = await Clientes.count();
    const comanda = await Comandas.count();
    const pedido = await Pedidos.count();
    const produto = await Produtos.count();
    const pedidoProduto = await PedidosProdutos.count();
    const pagamento = await Pagamentos.count();

    res.json({
      Mesas: mesas,
      Clientes: cliente,
      Comandas: comanda,
      Pedidos: pedido,
      Produtos: produto,
      PedidosProdutos: pedidoProduto,
      Pagamento: pagamento,
    });
  }
};
