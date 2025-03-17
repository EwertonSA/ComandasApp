
  module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('clientes', {
        id: { type: Sequelize.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        nome: { type: Sequelize.DataTypes.STRING, allowNull: false },
        telefone:{type:Sequelize.DataTypes.STRING},
        mesa_id: {
          type: Sequelize.DataTypes.INTEGER,
          references: {
            model: 'mesas', // Tabela referenciada
            key: 'id'
          },
          onDelete: 'CASCADE', // Se a mesa for deletada, os clientes relacionados também serão deletados
          allowNull: true // Se um cliente não tiver mesa associada
        },
        created_at: { type: Sequelize.DataTypes.DATE },
        updated_at: { type: Sequelize.DataTypes.DATE }
      });
    },
    down: async (queryInterface) => {
      await queryInterface.dropTable('clientes');
    }
  };