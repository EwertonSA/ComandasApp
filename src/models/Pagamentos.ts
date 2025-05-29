import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from  "../database/index.js";

export interface Pagamento{
    id:number,
    comandaId:number,
    valor:number,
    formaPagamento:string,
    status:string,
    createdAt?:Date,
    updatedAt?:Date
}
export interface PagamentoAttributes extends Optional<Pagamento,'id'>{}
export interface PagamentoInstance extends Model<Pagamento,PagamentoAttributes>,Pagamento{}
const Pagamentos=sequelize.define<PagamentoInstance>('pagamentos',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    comandaId: {
        type:DataTypes.INTEGER,
        references: {
          model: 'comandas',
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
      },
      createdAt:{
        type:DataTypes.DATE
      },
      updatedAt:{
        type:DataTypes.DATE
      }
})
export default Pagamentos