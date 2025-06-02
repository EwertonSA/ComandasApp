import { Sequelize } from "sequelize";
import { DATABASE_URL } from "../config/environment.js";

export const sequelize= new Sequelize(DATABASE_URL,{
    define:{
        underscored:true
    }
})