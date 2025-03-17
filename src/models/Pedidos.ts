import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

export interface Pedido{
    id:number,
    comandaId:number,
    total:number,
    status:string
}
export interface PedidoAttributes extends Optional<Pedido, 'id'>{}
export interface PedidoInstance extends Model<Pedido,PedidoAttributes>,Pedido{}

const Pedidos= sequelize.define<PedidoInstance>('pedidos',{
    id:{
           type:DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
    },
    comandaId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'comandas',
            key:'id'
        },
        onDelete:'CASCADE'

    },
    total:{
        type:DataTypes.DECIMAL(10, 2),
        allowNull:false
    },
    status:{
        type:DataTypes.STRING,
        allowNull:false
    }
})
export default Pedidos