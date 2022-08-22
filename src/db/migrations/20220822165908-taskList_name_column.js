'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.sequelize.transaction((t) =>
        // add nullish column
        queryInterface.addColumn(
            'tasklists',
            'name',
            {
              type: Sequelize.STRING(500),
            }
        )
            // fill with default values
            .then(() => queryInterface.sequelize.query(`UPDATE tasklists SET name=''`))
            // change column to non-nullish
            .then(() => queryInterface.changeColumn(
                'tasklists',
                'name',
                {
                  type: Sequelize.STRING(500),
                  allowNull: false,
                  defaultValue: false,
                }
            ))
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn(
        'tasklist',
        'name',
    );
  }
};
