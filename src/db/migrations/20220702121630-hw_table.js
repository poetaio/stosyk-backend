'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        const {HomeworkTable, TaskListTable} = require("../migrations-schemas/lesson")(Sequelize);

        return queryInterface.sequelize.transaction((t) =>
            queryInterface.createTable(...HomeworkTable, { transaction: t })
                .then(() => queryInterface.addColumn(
                    TaskListTable[0],
                    'homeworkId',
                    {
                        type: Sequelize.UUID,
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                        references: {
                            model: HomeworkTable[0],
                            key: 'homeworkId',
                        }
                    },
                    { transaction: t }
                    ))
        );
    },

    async down(queryInterface, Sequelize) {
        const {HomeworkTable, TaskListTable} = require("../migrations-schemas/lesson")(Sequelize);

        return queryInterface.sequelize.transaction((t) =>
            queryInterface.removeColumn(TaskListTable[0], 'homeworkId', { transaction: t })
                .then(() => queryInterface.dropTable(HomeworkTable[0], {
                    transaction: t,
                    cascade: true,
                }))
        );
    }
};
