'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('pedidos_produtos', [
      {
        pedido_id: 6,  // ID de um pedido existente
        produto_id: 2, // ID de um produto existente
        quantidade: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        pedido_id: 7,  
        produto_id: 1, 
        quantidade: 5,
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('pedidos_produtos', null, {});
  }
};
