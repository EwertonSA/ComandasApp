import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

export interface Mesas{
    id:number,
    numero:number,
    capacidade:number,
}

export interface MesasCreationAttributes extends Optional<Mesas, 'id'> {}

export interface MesasInstance extends Model<Mesas, MesasCreationAttributes>, Mesas {}

export const Mesas= sequelize.define<MesasInstance>('mesas',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    numero:{
         allowNull: false,
                type: DataTypes.NUMBER,
    },
    capacidade:{
        allowNull: false,
        type: DataTypes.NUMBER,
    }
})
