import  PedidosProdutos  from "../models/pedidosProdutos.js";
import Produtos from "../models/Produtos.js"
import Pedidos from "../models/Pedidos.js"

export async function atualizarTotalPedido(pedidoId: number) {
    const pedidoProdutos = await PedidosProdutos.findAll({
      where: { pedidoId },
      include: [{ model: Produtos, as: "produto", attributes: ["preco"] }],
    });
  
    const total = pedidoProdutos.reduce((acc, item) => {
      return acc + (item.produto?.preco || 0) * item.quantidade;
    }, 0);
  
    await Pedidos.update({ total }, { where: { id: pedidoId } });
  }
  
  // Registrar hooks no modelo PedidosProdutos
  export function registerHooks() {
    // Aqui o modelo já deve estar carregado
    PedidosProdutos.afterCreate(async (pedidoProduto) => {
      await atualizarTotalPedido(pedidoProduto.pedidoId);
    });
  
    PedidosProdutos.afterUpdate(async (pedidoProduto) => {
      await atualizarTotalPedido(pedidoProduto.pedidoId);
    });
  
    PedidosProdutos.afterDestroy(async (pedidoProduto) => {
      await atualizarTotalPedido(pedidoProduto.pedidoId);
    });
  }