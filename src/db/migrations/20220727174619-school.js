module.exports = {
    async up(queryInterface, Sequelize) {
        const {LessonTable, CourseTable} = require('../schema/lesson')(Sequelize);
        const {SchoolTable} = require('../schema/school')(Sequelize);

        return queryInterface.sequelize.transaction((transaction) =>
            queryInterface.createTable(...SchoolTable, { transaction })
                .then(() => queryInterface.addColumn(
                    LessonTable[0],
                    'schoolId',
                    {
                        type: Sequelize.UUID,
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                        references: {
                            model: SchoolTable[0],
                            key: 'schoolId',
                        }
                    },
                    { transaction }
                ))
                .then(() => queryInterface.addColumn(
                    CourseTable[0],
                    'schoolId',
                    {
                        type: Sequelize.UUID,
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                        references: {
                            model: SchoolTable[0],
                            key: 'schoolId',
                        },
                    },
                    { transaction }
                ))
        )
    },

    async down(queryInterface, Sequelize) {
        const {LessonTable, CourseTable} = require("../schema/lesson")(Sequelize);
        const {SchoolTable} = require('../schema/school')(Sequelize);

        return queryInterface.sequelize.transaction((transaction) =>
            queryInterface.removeColumn(CourseTable[0], 'schoolId', { transaction })
                .then(() => queryInterface.removeColumn(LessonTable[0], 'schoolId', { transaction }))
                .then(() => queryInterface.dropTable(SchoolTable[0], { transaction }))
        );
    }
};
