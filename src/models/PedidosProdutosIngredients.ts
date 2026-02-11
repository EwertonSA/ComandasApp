import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database/index.js";

export interface PedidosProdutosIngredient{
    id:number,
    pedidoProdutoId:number,
    ingredientId:number,
    include:boolean
}
export interface PedidosProdutosIngredientsCreationAttributes extends Optional<PedidosProdutosIngredient,'id'>{}

export interface PedidosProdutosIngredientsInstance extends Model<PedidosProdutosIngredient,PedidosProdutosIngredientsCreationAttributes>,PedidosProdutosIngredient{}

export const PedidosProdutosIngredients=sequelize.define<PedidosProdutosIngredientsInstance>('pedidosProdutosIngredients',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    pedidoProdutoId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'pedidosProdutos',
            key:'id'
        },
        onUpdate:'CASCADE',
        onDelete:'CASCADE'
    },
    ingredientId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'ingredients',
            key:'id'
        },
        onUpdate:'CASCADE',
        onDelete:'CASCADE'
    },
    include:{
        type:DataTypes.BOOLEAN,
        allowNull:true,
        defaultValue:true
    }
})