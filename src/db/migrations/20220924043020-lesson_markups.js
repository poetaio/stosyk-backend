/**
 * Migration summary:
 * 1. Add table lessonMarkup
 * 2. Include teacherId in lessonMarkup which references relation between teacher & lessonMarkup,
 *    note that teacherLesson is preserved to represent lessonHistory and teacher who ran the lesson
 * 3. Add fk in taskList table to lessonMarkup
 * 4. Add fk in homework table to lessonMarkup
 * 5. Add fk in lesson table to lessonMarkup
 * 6. Drop lessonCourse
 * 7. Create new lessonCourse which references lessonMarkup
 */
module.exports = {
    async up(queryInterface, Sequelize) {
        const {LessonMarkupTable, LessonCourseTable} = require("../migrations-schemas/20220806043020-lesson-markups")(Sequelize);

        return queryInterface.sequelize.transaction((transaction) =>
            queryInterface.createTable(...LessonMarkupTable, { transaction })
                .then(() => queryInterface.addColumn(
                    'lessons',
                    'lessonMarkupId',
                    {
                        type: Sequelize.UUID,
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                        references: {
                            model: LessonMarkupTable[0],
                            key: 'lessonMarkupId',
                        },
                    }, {
                        transaction
                    }
                )).then(() => queryInterface.addColumn(
                    'taskLists',
                    'lessonMarkupId',
                    {
                        type: Sequelize.UUID,
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                        references: {
                            model: LessonMarkupTable[0],
                            key: 'lessonMarkupId',
                        },
                    }, {
                        transaction
                    }
                )).then(() => queryInterface.addColumn(
                    'homeworks',
                    'lessonMarkupId',
                    {
                        type: Sequelize.UUID,
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                        references: {
                            model: LessonMarkupTable[0],
                            key: 'lessonMarkupId',
                        },
                    }, {
                        transaction
                    }
                )).then(() => queryInterface.dropTable('lessonCourses', {
                    transaction,
                    cascade: true,
                })).then(() => queryInterface.createTable(...LessonCourseTable, {
                    transaction,
                })).then(() => queryInterface.addColumn(
                'homeworks',
                'homeworkMarkupId',
                {
                    type: Sequelize.UUID,
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                    references: {
                        model: 'homeworks',
                        key: 'homeworkId',
                    },
                }, {
                    transaction
                }
            )).then(() => queryInterface.removeColumn(
                    'lessons',
                    'schoolId',
                    { transaction },
                ))
        );
    },

    async down(queryInterface, Sequelize) {
        const {LessonCourseTable} = require("../migrations-schemas/relations")(Sequelize);

        return queryInterface.sequelize.transaction((transaction) =>
            queryInterface.removeColumn(
                'lessons',
                'lessonMarkupId',
                { transaction },
            )
                .then(() => queryInterface.removeColumn(
                    'taskLists',
                    'lessonMarkupId',
                    { transaction },
                )).then(() => queryInterface.removeColumn(
                    'homeworks',
                    'lessonMarkupId',
                    { transaction },
                )).then(() => queryInterface.removeColumn(
                    'homeworks',
                    'homeworkMarkupId',
                    { transaction },
                )).then(() => queryInterface.dropTable(
                    'lessonMarkups',
                    {
                        transaction,
                        cascade: true,
                    }
                )).then(() => queryInterface.dropTable(
                    "lessonCourses",
                    {
                        transaction,
                        cascade: true,
                    }
                )).then(() => queryInterface.createTable(
                    ...LessonCourseTable,
                    { transaction },
                ))
                .then(() => queryInterface.addColumn(
                    'lessons',
                    'schoolId',
                    {
                        type: Sequelize.UUID,
                        onDelete: 'CASCADE',
                        onUpdate: 'CASCADE',
                        references: {
                            model: 'schools',
                            key: 'schoolId',
                        },
                    },
                    { transaction }
                ))
        );
    }
};
