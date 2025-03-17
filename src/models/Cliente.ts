

import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../database';

export interface Cliente {
  id: number; 
 
  nome: string;
  telefone: string;
  mesaId:number, 
}

export interface ClienteCreationAttributes extends Optional<Cliente, 'id'> {}

export interface ClienteInstance extends Model<Cliente, ClienteCreationAttributes>, Cliente {}

export const Clientes = sequelize.define<ClienteInstance>(
    "clientes",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
     
      nome: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      telefone: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      mesaId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'mesas', // Tabela referenciada
          key: 'id'
        },
        onDelete: 'CASCADE', // Se a mesa for deletada, os clientes relacionados também serão deletados
        allowNull: true // Se um cliente não tiver mesa associada
      },
    },
   
    {
      tableName: "clientes",
      timestamps: true, // Garante que Sequelize crie e atualize os campos createdAt e updatedAt automaticamente
    }
  );
