'use strict';

const accountStatusEnum = require("../../utils/enums/accountStatus.enum");
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
        // add nullish column
        queryInterface.addColumn(
            'accounts',
            'status',
            {
              type: Sequelize.ENUM(...Object.values(accountStatusEnum)),
            },
            { transaction: t }
        )
            // fill with default values
            // .then(() => queryInterface.sequelize.query(`UPDATE accounts SET status='UNVERIFIED'`, { transaction: t }))
            // .then(() => queryInterface.sequelize.query(`ALTER TABLE accounts ALTER COLUMN status SET DEFAULT 'UNVERIFIED'`, { transaction: t }))
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
        queryInterface.removeColumn(
            'accounts',
            'status',
            { transaction: t },
        )
    );
  }
};
