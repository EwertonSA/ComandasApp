  'use strict';

  module.exports = {
    async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ingredients',[
      {name:'Sal', created_at: new Date(), updated_at: new Date()},
      {name:'Açucar', created_at: new Date(), updated_at: new Date()},
      {name:'Manteiga', created_at: new Date(), updated_at: new Date()},
      {name:'Limão', created_at: new Date(), updated_at: new Date()},
      {name:'Limão espremido', created_at: new Date(), updated_at: new Date()},
      {name:'Cream Cheese', created_at: new Date(), updated_at: new Date()},
      {name:'Catupiri', created_at: new Date(), updated_at: new Date()},
      {name:'Muzzarela', created_at: new Date(), updated_at: new Date()},
      {name:'Queijo Parmesão', created_at: new Date(), updated_at: new Date()},
      {name:'Cheddar', created_at: new Date(), updated_at: new Date()},
      {name:'Gelo', created_at: new Date(), updated_at: new Date()},
      {name:'Leite', created_at: new Date(), updated_at: new Date()},
      {name:'Ponto Para Mais', created_at: new Date(), updated_at: new Date()},
      {name:'Ao Ponto', created_at: new Date(), updated_at: new Date()},
      {name:'Ponto Para menos', created_at: new Date(), updated_at: new Date()},
      {name:'Mal passado', created_at: new Date(), updated_at: new Date()}


    ])
    },

    async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ingredients', null, {});
    }
  };
