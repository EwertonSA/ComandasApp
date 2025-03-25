import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";
import Pedidos from "./Pedidos";
import Produtos, { ProdutoInstance } from "./Produtos";

export interface PedidoProduto {
  id: number;
  pedidoId: number;
  produtoId: number;
  quantidade: number;
}
export interface PedidoProdutoAttributes extends Optional<PedidoProduto, 'id'>{}
export interface PedidoProdutoInstance
  extends Model<PedidoProduto, PedidoProdutoAttributes>,
    PedidoProduto {
  produto?: ProdutoInstance; // Adicionando o relacionamento
}

    
const PedidosProdutos = sequelize.define<PedidoProdutoInstance>(
  "pedidos_produtos",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pedidoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Pedidos,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    produtoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Produtos,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }
);

PedidosProdutos.afterCreate(async (pedidoProduto) => {
  await atualizarTotalPedido(pedidoProduto.pedidoId);
});

PedidosProdutos.afterUpdate(async (pedidoProduto) => {
  await atualizarTotalPedido(pedidoProduto.pedidoId);
});

PedidosProdutos.afterDestroy(async (pedidoProduto) => {
  await atualizarTotalPedido(pedidoProduto.pedidoId);
});

async function atualizarTotalPedido(pedidoId: number) {
  const pedidoProdutos = await PedidosProdutos.findAll({
    where: { pedidoId },
    include: [{ model: Produtos, as: "produto", attributes: ["preco"] }],
  });

  const total = pedidoProdutos.reduce((acc, item) => {
    return acc + (item.produto?.preco || 0) * item.quantidade;
  }, 0);

  await Pedidos.update({ total }, { where: { id: pedidoId } });
}
export default PedidosProdutos;
