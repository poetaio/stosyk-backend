const {Task, Lesson, TaskSentence,
    sequelize,
    DELETE_TASK_BY_LESSON_ID,
    DELETE_SENTENCES_BY_TASK_ID,
    DELETE_GAPS_BY_SENTENCE_ID,
    DELETE_OPTIONS_BY_GAP_ID
} = require("../../models");
const sentenceService = require('./sentenceService');
const {DBError, NotFoundError, ValidationError, LessonStatusEnum} = require('../../utils');

class TaskService {
    // todo: existsWithAnswerShown
    async teacherTaskExists(taskId, teacherId){
        return !!await Lesson.count({
            include: [
                {
                    association: 'lessonTaskList',
                    include: {
                        association: 'taskListTaskListTasks',
                        include: {
                            association: 'taskListTaskTask',
                            where: { taskId },
                            required: true
                        }
                    }
                },
                {
                    association: 'lessonLessonTeacher',
                    where: {
                        teacherId
                    },
                    required: true
                }
            ]
        });
    }

    async existsAndLessonActive(taskId) {
        return !!await Task.count({
            where: { taskId },
            include: {
                association: 'taskTaskListTask',
                include: {
                    association: 'taskListTaskTaskList',
                    include: {
                        association: 'taskListLesson',
                        where: {
                            status: LessonStatusEnum.ACTIVE
                        },
                        required: true
                    },
                    required: true
                },
                required: true
            },
            required: true
        });
    }

    async existsWithAnswerShown(taskId) {
        return !!await Task.count({
            where: {
                taskId,
                answersShown: true
            }
        });
    }
    
    async showAnswers(taskId, teacherId) {
        if (!await this.teacherTaskExists(taskId, teacherId)){
            throw new NotFoundError(`No task ${taskId} of such teacher ${teacherId}`);
        }

        if (!await this.existsAndLessonActive(taskId)) {
            throw new ValidationError(`Lesson of task is not active taskId: ${taskId}`);
        }

        if (await this.existsWithAnswerShown(taskId)) {
            throw new ValidationError(`Answers for task are already shown, taskId: ${taskId}`);
        }

        const upd = await Task.update({
            answersShown: true
        }, {
            where: {
                taskId
            }
        });

        return !!upd[0];
    }
    
    async create(answerShown, sentences) {
        const task = await Task.create({ answerShown });

        for (let { index, text, gaps } of sentences) {
            const newSentence = await sentenceService.create(index, text, gaps);

            await TaskSentence.create({ taskId: task.taskId, sentenceId: newSentence.sentenceId });
        }

        return task;
    }

    async getAll({ lessonId }) {
        const where = {};
        // if lessonId is null, task will not have taskLessonTask as child,
        // thus no need to require = true
        let required = false;
        if (lessonId) {
            where.lessonId = lessonId;
            required = true;
        }

        return await Task.findAll({
            include: {
                association: 'taskTaskListTask',
                include: {
                    association: 'taskListTaskTaskList',
                    include: {
                        association: 'taskListLesson',
                        where,
                        required
                    },
                    required: true
                },
                required: true
            }
        });
    }

    async deleteByLessonId(lessonId) {
        const tasks = await Task.findAll({
            include: {
                association: 'taskTaskListTask',
                include: {
                    association: 'taskListLesson',
                    where: { lessonId },
                    required: true
                },
                required: true
            }
        });

        for (let task of tasks) {
            await task.destroy({
                individualHooks: true
            });
        }

        return !!tasks.length;
    }

    async deleteByLessonIdOld(lessonId) {
        const [ deletedTasks ] = await sequelize.query(DELETE_TASK_BY_LESSON_ID, {
            replacements: { lessonId }
        });

        for (let { taskId } of deletedTasks) {
            const [ deletedSentences ] = await sequelize.query(DELETE_SENTENCES_BY_TASK_ID, {
                replacements: { taskId }
            });

            for (let { sentenceId } of deletedSentences) {
                const [ deletedGaps ] = await sequelize.query(DELETE_GAPS_BY_SENTENCE_ID, {
                    replacements: { sentenceId }
                });

                for (let { gapId } of deletedGaps) {
                    await sequelize.query(DELETE_OPTIONS_BY_GAP_ID, {
                        replacements: { gapId }
                    });
                }
            }
        }
    }
}

module.exports = new TaskService();
