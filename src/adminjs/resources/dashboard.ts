import AdminJS, { ComponentLoader, PageHandler } from "adminjs"
import path from "path"
import { Mesas } from "../../models/Mesas.js"
import { Clientes } from "../../models/Cliente.js"
import { Comandas } from "../../models/Comandas.js"
import Pedidos from "../../models/Pedidos.js"
import Produtos from "../../models/Produtos.js"
import PedidosProdutos from "../../models/pedidosProdutos.js"
import Pagamentos from "../../models/Pagamentos.js"
import { UserModel } from "../../models/User.js"

// 🔧 Registrar o loader
export const componentLoader = new ComponentLoader()

// ✅ Registrar o componente com nome 'Dashboard'
componentLoader.add(
  'Dashboard',
  path.join(process.cwd(), 'src', 'adminjs', 'component', 'dashboard.tsx')
)

// ✅ Referenciar o nome registrado
export const dashboardOptions: {
  handler?: PageHandler
  component?: string
} = {
  component: 'Dashboard', // aqui é o nome que você deu no add()
  handler: async (req, res, context) => {
    const mesas = await Mesas.count()
    const cliente = await Clientes.count()
    const comanda = await Comandas.count()
    const produto = await Produtos.count()
    const pedido = await Pedidos.count()
    const pedidoProduto = await PedidosProdutos.count()
    const pagamento = await Pagamentos.count()
    const standardUsers = await UserModel.count({ where: { role: 'user' } })

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
