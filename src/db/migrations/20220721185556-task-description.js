'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    return queryInterface.sequelize.transaction((t) =>
        // add nullish column
        queryInterface.addColumn(
            'tasks',
            'description',
            {
              type: Sequelize.STRING(500),
            }
        )
            // fill with default values
            .then(() => queryInterface.sequelize.query(`UPDATE tasks SET description=''`))
            // change column to non-nullish
            .then(() => queryInterface.changeColumn(
                'tasks',
                'description',
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
        'task',
        'description',
    );
  }
};
