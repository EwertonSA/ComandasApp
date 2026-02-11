import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/index.js";

export interface ProductIngredient{
id:number,
productId:number,
ingredientId:number,
optional:boolean
}

export interface ProductIngredientCreationAttibutes extends Optional<ProductIngredient,'id'>{}

export interface ProductIngredientInstance extends Model<ProductIngredient,ProductIngredientCreationAttibutes>,ProductIngredient{}

export const ProductsIngredients= sequelize.define<ProductIngredientInstance>('products_ingredients',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    productId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'produtos',
            key:'id'
        }
    },
    ingredientId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'ingredients',
            key:'id'
        }
    },
    optional:{
        type:DataTypes.BOOLEAN,
        allowNull:false,
        defaultValue:true
    }
})