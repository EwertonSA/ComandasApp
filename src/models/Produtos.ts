import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from  "../database/index.js";

export interface Produto{
    id:number,
    nome:string,
    descricao:string,
    preco:number,
    categoria:string
    thumbnailUrl: string
}
export interface ProdutoAttributes extends Optional<Produto, 'id'>{}
export interface ProdutoInstance extends Model<Produto,ProdutoAttributes>,Produto{}

const Produtos= sequelize.define<ProdutoInstance>('produtos',{
    id:{
       type:DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
    },
    nome:{
        type:DataTypes.STRING,
        allowNull:false
    },
    descricao:{
        type:DataTypes.STRING, allowNull: false
    },
    preco:{
        type:DataTypes.DECIMAL(10, 2), allowNull: false
    },
    categoria:{
        type:DataTypes.STRING, allowNull: false
    },
    thumbnailUrl: {
        type: DataTypes.STRING
      },
})
export default Produtos