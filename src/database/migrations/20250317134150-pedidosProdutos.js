module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pedidos_produtos', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      pedido_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'pedidos',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      produto_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'produtos',
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      quantidade: { type: Sequelize.DataTypes.INTEGER, allowNull: false },
      created_at: { type: Sequelize.DataTypes.DATE },
      updated_at: { type: Sequelize.DataTypes.DATE }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('pedidos_produtos');
  }
};
