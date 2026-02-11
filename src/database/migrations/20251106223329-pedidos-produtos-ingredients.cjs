'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('pedidos_produtos_ingredients',{
    id:{
      type:Sequelize.DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true,
      allowNull:false
    },
    pedido_produto_id:{
      type:Sequelize.DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'pedidos_produtos',
        key:'id'
      },
       onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    ingredient_id:{
      type:Sequelize.DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:'ingredients',
        key:'id'
      },
       onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    include:{
      type:Sequelize.DataTypes.BOOLEAN,
      allowNull:true,
      defaultValue: true,
    },
      created_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
   })
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.dropTable('pedidos_produtos_ingredients')
  }
};
