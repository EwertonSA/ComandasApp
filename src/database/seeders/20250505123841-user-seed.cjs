'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash('123123', 10);
    return queryInterface.bulkInsert('users', [{
      email: 'usuario@example.com',
      password: hashedPassword,
      role: 'user', // <-- adiciona isso aqui
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', {
      email: 'usuario@example.com'
    });
  }
};