
import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../database";

export interface User{
    id:number,
    name?:string,
    phone?:string,
    email:string,
    password?:string,
    
    role:'user'|'cliente'
}
export interface UserCreationAttributes extends Optional<User,'id'>{}

export interface UserInstance extends Model<User, UserCreationAttributes>,User{}

export const UserModel=sequelize.define<UserInstance,User>('users',{
    id:{
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
        type:DataTypes.INTEGER

    },
    name:{
        allowNull:true,
        type:DataTypes.STRING
    },
    phone:{
        allowNull:true,
        type:DataTypes.STRING
    },
    email:{
        allowNull:false,
        unique:true,
        type:DataTypes.STRING,
        validate:{
            isEmail:true
        }
    },
    password:{
        allowNull:true,
        type:DataTypes.STRING
    },
    role:{
        allowNull:false,
        type:DataTypes.STRING,
        validate:{
            isIn:[['user','cliente']]
        }
    }
})