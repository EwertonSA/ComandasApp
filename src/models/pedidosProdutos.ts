import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

export interface PedidoProduto{
    pedidoId:number,
    produtoId:number,
    quantidade:number
}
export interface PedidoProdutoAttributes extends Optional<PedidoProduto, 'quantidade'>{}
export interface PedidoProdutoInstance extends Model<PedidoProduto,PedidoProdutoAttributes>,PedidoProduto{}

const PedidosProdutos= sequelize.define<PedidoProdutoInstance>('pedidos_produtos',{
    pedidoId:{
        type:DataTypes.INTEGER,
        references: {
          model: 'pedidos',
          key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true, // Chave primária composta
        allowNull: false
      },
      produtoId:{
        type:DataTypes.INTEGER,
        references: {
          model: 'produtos',
          key: 'id'
        },
        onDelete: 'CASCADE',
        primaryKey: true, // Chave primária composta
        allowNull: false
      },
      quantidade:{
        type:DataTypes.INTEGER,
        allowNull:false
      }
    }
)
export default PedidosProdutos