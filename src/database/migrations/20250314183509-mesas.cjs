
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mesas', {
      id: { 
        type: Sequelize.DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
      },
      numero: { 
        type: Sequelize.DataTypes.INTEGER, 
        allowNull: false,
        unique: true // Cada mesa terá um número único
      },
      capacidade: { 
        type: Sequelize.DataTypes.INTEGER, 
        allowNull: false 
      },
      created_at: { 
        type: Sequelize.DataTypes.DATE, 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
      },
      updated_at: { 
        type: Sequelize.DataTypes.DATE, 
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
      }
    });
  },
  
  down: async (queryInterface) => {
    await queryInterface.dropTable('mesas');
  }
};
