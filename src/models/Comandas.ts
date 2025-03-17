import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { sequelize } from "../database";

export interface Comanda{
    id:number,
    mesaId:number,
    clienteId:number
}
export interface ComandaAttributes extends Optional<Comanda, "id">{}
export interface ComandaInstance extends Model<Comanda,ComandaAttributes>,Comanda{}
export const Comandas= sequelize.define<ComandaInstance>('comandas',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    mesaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "mesas",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      clienteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "clientes",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      tableName: "comandas", // Nome real da tabela no banco
      timestamps: true, // Ativa createdAt e updatedAt automaticamente
    }
  );
  
  export default Comanda;
  