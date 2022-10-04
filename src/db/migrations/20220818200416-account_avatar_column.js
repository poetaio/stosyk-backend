'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
        // add nullish column
        queryInterface.addColumn(
            'accounts',
            'avatar_source',
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
            'accounts',
            'avatar_source',
            { transaction: t },
        )
    );
  }
};
