'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
        // add nullish column
        queryInterface.addColumn(
            'users',
            'name',
            {
              type: Sequelize.STRING(500),
            },
            { transaction: t }
        )
            // fill with default values
            .then(() => queryInterface.sequelize.query(`UPDATE users SET name='Name'`, { transaction: t }))
            // change column to non-nullish
            .then(() => queryInterface.changeColumn(
                'users',
                'name',
                {
                  type: Sequelize.STRING(500),
                  allowNull: false,
                  defaultValue: false,
                },
                { transaction: t }
            ))
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
        queryInterface.removeColumn(
            'users',
            'name',
            { transaction: t },
        )
    );
  }
};
