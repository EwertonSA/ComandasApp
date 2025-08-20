'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
  await Promise.all([ queryInterface.addColumn('users','two_factor_enabled',{
    type:Sequelize.BOOLEAN,
    allowNull:true,
    defaultValue:false
  }),
  queryInterface.addColumn('users','two_factor_secret',{
    type:Sequelize.STRING,
    allowNull:true
  })
])
  },
  async down (queryInterface, Sequelize) {
  await queryInterface.removeColumn('users',"two_factor_enabled"),
   queryInterface.removeColumn('users',"two_factor_secret")
  
  }
};
