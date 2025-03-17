'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
await queryInterface.bulkInsert("produtos",[
  {id:1,categoria:"Bebidas",nome:'Cerveja',descricao:"Stella",preco:12,created_at:new Date(),updated_at:new Date()},
  {id:2,categoria:"Porções",nome:'Isca de peixe', descricao:'tilápia em postas',preco:54,created_at:new Date(),updated_at:new Date()},
  {id:3,categoria:'Entradas', nome:'batata frita',descricao:'Batata palito com farofa de bacon',preco:25,created_at:new Date(),updated_at:new Date() }
])
  },

  async down (queryInterface, Sequelize) {
 await queryInterface.bulkDelete('produtos',null,{})
  }
};
