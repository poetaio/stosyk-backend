'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {

        return queryInterface.sequelize.transaction((t) =>
            // add nullish column
            queryInterface.addColumn(
                'lessons',
                'description',
                {
                    type: Sequelize.STRING(500),
                }
            )
                // fill with default values
                .then(() => queryInterface.sequelize.query(`UPDATE lessons SET description='Урок учителя для учнів'`))
                // change column to non-nullish
                .then(() => queryInterface.changeColumn(
                    'lessons',
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
            'lesson',
            'description',
        );
    }
};
