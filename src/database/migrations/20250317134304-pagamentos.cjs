module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('pagamentos', {
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        comanda_id: {
          type: Sequelize.DataTypes.INTEGER,
          references: {
            model: 'comandas', // Tabela referenciada
            key: 'id'
          },
          onDelete: 'CASCADE',
          allowNull: false
        },
        valor: { type: Sequelize.DataTypes.DECIMAL(10, 2), allowNull: false },
        forma_pagamento: { type: Sequelize.DataTypes.STRING, allowNull: false },
        status: { type: Sequelize.DataTypes.STRING, allowNull: false },
        created_at: { type: Sequelize.DataTypes.DATE },
        updated_at: { type: Sequelize.DataTypes.DATE }
      });
    },
    down: async (queryInterface) => {
      await queryInterface.dropTable('pagamentos');
    }
  };