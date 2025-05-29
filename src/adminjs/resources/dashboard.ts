import AdminJS, { ComponentLoader, PageHandler } from "adminjs";

import path from "path";
import { Mesas } from "../../models/Mesas.js";
import { Clientes } from "../../models/Cliente.js";
import { Comandas } from "../../models/Comandas.js";
import Pedidos  from "../../models/Pedidos.js";
import Produtos  from "../../models/Produtos.js";
import  PedidosProdutos  from "../../models/pedidosProdutos.js";
import Pagamentos from "../../models/Pagamentos.js";





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
