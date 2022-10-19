'use strict';

module.exports = {
  async up (queryInterface, DataTypes) {

    const {SubpackageTable} = require('../schema')(DataTypes);

    return queryInterface.sequelize.transaction((t) =>
        queryInterface.createTable(...SubpackageTable, { transaction: t }))
  },

  async down (queryInterface, DataTypes) {

    const {SubpackageTable} = require('../schema')(DataTypes);

    return queryInterface.sequelize.transaction((t) =>
        queryInterface.dropTable(SubpackageTable[0], {
          transaction: t,
          cascade: true,
        }))
  }
};
