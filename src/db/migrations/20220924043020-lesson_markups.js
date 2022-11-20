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
const { SELECT_ALL_LESSONS_WITH_TASKLISTS_WITH_COURSES, INSERT_INTO_LESSON_MARKUP, INSERT_INTO_LESSON_COURSE,
    SELECT_ALL_HOMEWORKS_WITH_TASKLIST_BY_LESSON_ID, INSERT_INTO_HOMEWORKS, INSERT_INTO_TASKLIST_LESSON_MARKUP,
    INSERT_INTO_TASKLIST_HOMEWORK, SELECT_ALL_TASKS_BY_TASKLIST_ID, INSERT_INTO_TASK, INSERT_INTO_TASKLIST_TASK,
    SELECT_ALL_SENTENCES_BY_TASK_ID, INSERT_INTO_SENTENCE, INSERT_INTO_TASK_SENTENCE, SELECT_ALL_GAP_BY_SENTENCES_ID,
    INSERT_INTO_GAP, INSERT_INTO_SENTENCE_GAP, SELECT_ALL_OPTIONS_BY_GAP_ID, INSERT_INTO_OPTION, INSERT_INTO_GAP_OPTION,
    UPDATE_HOMEWORK_MARKUP_ID_IN_HOMEWORK, UPDATE_LESSON_MARKUP_ID_IN_LESSON
} = require("../schema/20220806043020-lesson-markups/queries");
const { v4 } = require("uuid");
const { logger } = require("../../utils");

module.exports = {
    async up(queryInterface, Sequelize) {
        const {LessonMarkupTable, LessonCourseTable} = require("../schema/20220806043020-lesson-markups")(Sequelize);

        return await queryInterface.sequelize.transaction(async (transaction) => {
                const [lessons] = await queryInterface.sequelize.query(SELECT_ALL_LESSONS_WITH_TASKLISTS_WITH_COURSES);

                await queryInterface.createTable(...LessonMarkupTable, { transaction })
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

                logger.info('Copying all lessons to markups...');

                // at this step we created all tables (markup etc) and copying data
                // except for lessons, cause we do not want to miss this info, as it will be overwritten to reference lessonMarkup
                for (let { lessonId, name, description, status, courseId, teacherId, taskListId, schoolId, lesCreatedAt, lesUpdatedAt, lesCoCreatedAt, lesCoUpdatedAt, talCreatedAt, talUpdatedAt } of lessons) {
                    const lessonMarkupId = v4();

                    // create lesson markup
                    logger.debug('Creating lesson markup for each lesson');
                    await queryInterface.sequelize.query({
                        query: INSERT_INTO_LESSON_MARKUP,
                        values: [lessonMarkupId, name, description, schoolId, teacherId, lesCreatedAt, lesUpdatedAt]
                    }, {transaction});

                    logger.debug('Relate each lesson to markup (set lessonMarkupId in lesson table)');
                    await queryInterface.sequelize.query({
                        query: UPDATE_LESSON_MARKUP_ID_IN_LESSON,
                        values: [lessonMarkupId, lessonId]
                    }, {transaction});

                    if (courseId) {
                        // adding relation with course
                        logger.debug('Relating lesson markup to course (inserting into lessonCourses)');
                        await queryInterface.sequelize.query({
                            query: INSERT_INTO_LESSON_COURSE,
                            values: [v4(), courseId, lessonMarkupId, lesCoCreatedAt, lesCoUpdatedAt]
                        }, { transaction });
                    }

                    // copying each homework
                    logger.debug(`Copying each homework of ${lessonId} in order to relate to lesson markup`);
                    const [homeworks] = await queryInterface.sequelize.query({
                        query: SELECT_ALL_HOMEWORKS_WITH_TASKLIST_BY_LESSON_ID,
                        values: [lessonId],
                    }, {transaction});

                    for (let { homeworkId, taskListId : oldHwTaskListId, hCreatedAt, hUpdatedAt, talCreatedAt, talUpdatedAt } of homeworks) {
                        logger.debug('Inserting into homework (with lessonMarkupId)');
                        const homeworkMarkupId = v4();
                        await queryInterface.sequelize.query({
                            query: INSERT_INTO_HOMEWORKS,
                            values: [homeworkMarkupId, lessonMarkupId, homeworkId, hCreatedAt, hUpdatedAt]
                        }, {transaction});

                        logger.debug('Inserting into taskList (with homeworkId)');
                        const newTaskListId = v4();
                        await queryInterface.sequelize.query({
                            query: INSERT_INTO_TASKLIST_HOMEWORK,
                            values: [newTaskListId, homeworkMarkupId, talCreatedAt, talUpdatedAt]
                        }, {transaction});

                        logger.debug('Relating each homework to homeworkMarkup (setting homeworkMarkupId)');
                        await queryInterface.sequelize.query({
                            query: UPDATE_HOMEWORK_MARKUP_ID_IN_HOMEWORK,
                            values: [homeworkMarkupId, homeworkId]
                        }, {transaction});

                        // copy each homework taskList to homeworkMarkup taskList
                        logger.debug('Copying homework taskList to homeworkMarkup taskList');
                        await copyTaskList(oldHwTaskListId, newTaskListId, queryInterface, transaction);
                    }

                    // add new taskList of lesson
                    logger.debug('Adding taskList to lessonMarkup (inserting into taskList)');
                    const newTaskListId = v4();
                    await queryInterface.sequelize.query({
                        query: INSERT_INTO_TASKLIST_LESSON_MARKUP,
                        values: [newTaskListId, lessonMarkupId, talCreatedAt, talUpdatedAt]
                    }, {transaction});

                    // copy each lesson taskList to lessonMarkup taskList
                    logger.debug('Copying lesson taskList to lessonMarkup taskList');
                    await copyTaskList(taskListId, newTaskListId, queryInterface, transaction);
                }
            }
        );
    },

    async down(queryInterface, Sequelize) {
        const {LessonCourseTable} = require("../schema/relations")(Sequelize);

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

const copyTaskList = async (oldTaskListId, newTaskListId, queryInterface, transaction) => {
    const [tasks] = await queryInterface.sequelize.query({
        query: SELECT_ALL_TASKS_BY_TASKLIST_ID,
        values: [oldTaskListId]
    }, {transaction});
    for (let { taskId, answersShown, type, description, taCreatedAt, taUpdatedAt } of tasks) {
        logger.debug('Inserting into task')
        const newTaskId = v4();
        await queryInterface.sequelize.query({
            query: INSERT_INTO_TASK,
            values: [newTaskId, description, answersShown, type, taCreatedAt, taUpdatedAt]
        }, {transaction});

        logger.debug('Inserting into tasklist-task')
        await queryInterface.sequelize.query({
            query: INSERT_INTO_TASKLIST_TASK,
            values: [v4(), newTaskListId, newTaskId, taCreatedAt, taUpdatedAt]
        }, {transaction});

        const [sentences] = await queryInterface.sequelize.query({
            query: SELECT_ALL_SENTENCES_BY_TASK_ID,
            values: [taskId]
        }, {transaction});

        for (let { sentenceId, index, text, createdAt, updatedAt } of sentences) {
            logger.debug('Inserting into sentence')
            const newSentenceId = v4();
            await queryInterface.sequelize.query({
                query: INSERT_INTO_SENTENCE,
                values: [newSentenceId, index, text, createdAt, updatedAt]
            }, {transaction});

            logger.debug('Inserting into task-sentence')
            await queryInterface.sequelize.query({
                query: INSERT_INTO_TASK_SENTENCE,
                values: [v4(), newTaskId, newSentenceId, createdAt, updatedAt]
            }, {transaction});

            const [gaps] = await queryInterface.sequelize.query({
                query: SELECT_ALL_GAP_BY_SENTENCES_ID,
                values: [sentenceId],
            }, {transaction});

            for (let { gapId, position, createdAt, updatedAt } of gaps) {
                logger.debug('Inserting into gap')
                const newGapId = v4();
                await queryInterface.sequelize.query({
                    query: INSERT_INTO_GAP,
                    values: [newGapId, position, createdAt, updatedAt]
                }, {transaction});

                logger.debug('Inserting into sentence-gap')
                await queryInterface.sequelize.query({
                    query: INSERT_INTO_SENTENCE_GAP,
                    values: [v4(), newSentenceId, newGapId, createdAt, updatedAt]
                }, {transaction});

                const [options] = await queryInterface.sequelize.query({
                    query: SELECT_ALL_OPTIONS_BY_GAP_ID,
                    values: [gapId]
                }, {transaction});

                for (let { optionId, value, isCorrect, createdAt, updatedAt } of options) {
                    logger.debug('Inserting into option')
                    const newOptionId = v4();
                    await queryInterface.sequelize.query({
                        query: INSERT_INTO_OPTION,
                        values: [newOptionId, value, isCorrect, createdAt, updatedAt]
                    }, {transaction});

                    logger.debug('Inserting into gap-option')
                    await queryInterface.sequelize.query({
                        query: INSERT_INTO_GAP_OPTION,
                        values: [v4(), gapId, newOptionId, createdAt, updatedAt]
                    }, {transaction});
                }
            }
        }
    }
};
