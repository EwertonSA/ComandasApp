import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

export interface Pagamento{
    id:number,
    pedidoId:number,
    valor:number,
    formaPagamento:string,
    status:string
}
export interface PagamentoAttributes extends Optional<Pagamento,'id'>{}
export interface PagamentoInstance extends Model<Pagamento,PagamentoAttributes>,Pagamento{}
const Pagamentos=sequelize.define<PagamentoInstance>('pagamentos',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    pedidoId: {
        type:DataTypes.INTEGER,
        references: {
          model: 'pedidos',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      valor:{
        type:DataTypes.DECIMAL(10, 2),
        allowNull:false
      },
      formaPagamento:{
        type:DataTypes.STRING,allowNull:false
      },
      status:{
        type:DataTypes.STRING,allowNull:false
      }
})
export default Pagamentos