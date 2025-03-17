
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('produtos', {
      id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      nome: { type: Sequelize.DataTypes.STRING, allowNull: false },
      descricao: { type: Sequelize.DataTypes.STRING, allowNull: false },
      preco: { type: Sequelize.DataTypes.DECIMAL(10, 2), allowNull: false },
      categoria: { type: Sequelize.DataTypes.STRING, allowNull: false },
      created_at: { type: Sequelize.DataTypes.DATE },
      updated_at: { type: Sequelize.DataTypes.DATE }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('produtos');
  }
};