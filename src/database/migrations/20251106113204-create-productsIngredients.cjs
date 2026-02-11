'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('products_ingredients',{
    id:{
      type:Sequelize.DataTypes.INTEGER,
      autoIncrement:true,
      primaryKey:true,
      allowNull:false
    },
    product_id:{
      type:Sequelize.DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'produtos',key:'id'
      },
          onUpdate:"CASCADE",
    onDelete:"CASCADE"
    },
    ingredient_id:{
      type:Sequelize.DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'ingredients',key:'id'
      },
          onUpdate:"CASCADE",
    onDelete:"CASCADE"
    },
    optional:{
      type:Sequelize.DataTypes.BOOLEAN,
      defaultValue:true
    },
    created_at: { type: Sequelize.DataTypes.DATE },
      updated_at: { type: Sequelize.DataTypes.DATE }
   })
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('products_ingredients')
  }
};
