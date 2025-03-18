import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

export interface PedidoProduto{
    pedido_id:number,
    produto_id:number,
    quantidade:number
}
export interface PedidoProdutoAttributes extends Optional<PedidoProduto, 'quantidade'>{}
export interface PedidoProdutoInstance extends Model<PedidoProduto,PedidoProdutoAttributes>,PedidoProduto{}

const PedidosProdutos = sequelize.define<PedidoProdutoInstance>('pedidos_produtos', {
  pedido_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey:true,
    references: {
      model: 'pedidos',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  produto_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey:true,
    references: {
      model: 'produtos',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})
export default PedidosProdutos