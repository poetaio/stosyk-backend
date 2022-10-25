'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
        queryInterface.removeColumn(
            'students',
            'name',
            { transaction: t },
        )
    );
  }
}
