import { DataTypes, Model, Optional} from "sequelize";
import { sequelize } from "../database/index.js";
export interface Ingredient{
id:number,
name:string
}
export interface IngredientsCreationAttributes extends Optional<Ingredient,'id'>{}

export interface IngredientsInstance extends Model<Ingredient,IngredientsCreationAttributes>,Ingredient {}

export const Ingredients=sequelize.define<IngredientsInstance>('ingredients',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    }
   
},
 {
        timestamps:true
    })