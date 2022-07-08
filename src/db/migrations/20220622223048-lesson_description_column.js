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
                },
                { transaction: t }
            )
                // fill with default values
                .then(() => queryInterface.sequelize.query(`UPDATE lessons SET description='Урок учителя для учнів'`, { transaction: t }))
                // change column to non-nullish
                .then(() => queryInterface.changeColumn(
                    'lessons',
                    'description',
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
                'lessons',
                'description',
                { transaction: t },
            )
        );
    }
};
