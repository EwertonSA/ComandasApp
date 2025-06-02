
  module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('clientes', {
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        nome: { type: Sequelize.DataTypes.STRING, allowNull: false },
       
        mesa_id: {
          type: Sequelize.DataTypes.INTEGER,
          references: {
            model: 'mesas', 
            key: 'id'
          },
          onDelete: 'CASCADE', 
          allowNull: true 
        },
        created_at: { type: Sequelize.DataTypes.DATE },
        updated_at: { type: Sequelize.DataTypes.DATE }
      });
    },
    down: async (queryInterface) => {
      await queryInterface.dropTable('clientes');
    }
  };