
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('comandas', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      mesa_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'mesas', // Tabela referenciada
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      
      cliente_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: 'clientes', // Tabela referenciada
          key: 'id'
        },
        onDelete: 'CASCADE',
        allowNull: false
      },
      status:{
        type:Sequelize.DataTypes.ENUM('pendente','parcial','pago'),
        allowNull:false,
        defaultValue:"pendente"
      },
      created_at: { type: Sequelize.DataTypes.DATE },
      updated_at: { type: Sequelize.DataTypes.DATE }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('comandas');
  }
};