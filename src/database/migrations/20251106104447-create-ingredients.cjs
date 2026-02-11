'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('ingredients',{
    id:{
      type:Sequelize.DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true,
      autoIncrement:true
    },
    name:{
      type:Sequelize.DataTypes.STRING,allowNull:false

    },
    created_at:{
      type:Sequelize.DataTypes.DATE,allowNull:false
    },
    updated_at:{
      type:Sequelize.DataTypes.DATE,allowNull:false
    }
   })
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('ingredients')
  }
};
