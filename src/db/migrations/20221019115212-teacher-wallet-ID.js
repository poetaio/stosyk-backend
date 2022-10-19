'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
        // add nullish column
        queryInterface.addColumn(
            'teachers',
            'walletId',
            {
              type: Sequelize.STRING(500),
            },
            { transaction: t }
        )
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
        queryInterface.removeColumn(
            'teachers',
            'walletId',
            { transaction: t },
        )
    );
  }
};
