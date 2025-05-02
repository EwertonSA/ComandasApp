'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
  await queryInterface.createTable('users', {
    id:{
      allowNull:false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.DataTypes.INTEGER
    },
    name:{
      allowNull:true,
      type:Sequelize.DataTypes.STRING
    },
    email:{
      allowNull:false,
      unique:true,
      type:Sequelize.DataTypes.STRING
    },
    phone:{
      allowNull:true,
      type: Sequelize.DataTypes.STRING
    },
    password:{
allowNull:true,
type:Sequelize.DataTypes.STRING
    },
    role:{
allowNull:false,
type:Sequelize.DataTypes.STRING
    },
    created_at:{
      allowNull:false,
      type:Sequelize.DataTypes.DATE,
    defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at:{
      allowNull:false,
      type:Sequelize.DataTypes.DATE,
      defaultValue:Sequelize.literal('CURRENT_TIMESTAMP')
    }
  })
  },

  async down (queryInterface, Sequelize) {
 await queryInterface.dropTable('users')
  }
};
