const {Task, Lesson, TaskSentence,
    sequelize,
    DELETE_TASK_BY_LESSON_ID,
    DELETE_SENTENCES_BY_TASK_ID,
    DELETE_GAPS_BY_SENTENCE_ID,
    DELETE_OPTIONS_BY_GAP_ID, taskWithLessonInclude, TaskAttachments
} = require("../../models");
const sentenceService = require('./sentenceService');
const {DBError, NotFoundError, ValidationError, LessonStatusEnum, TaskTypeEnum} = require('../../utils');
const studentService = require("../user/studentService");
const pubsubService = require("../pubsubService");
const lessonAnswersService = require("./lessonAnswersService");

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

    async showAnswers(pubsub, taskId, teacherId) {
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

        if (upd[0]) {
            const task = await Task.findOne({
                where: { taskId },
                include: taskWithLessonInclude
            });
            const lesson = task.taskTaskListTask.taskListTaskTaskList.taskListLesson;
            const lessonAnswers = await lessonAnswersService.getShownAnswers(lesson.lessonId);
            for (let { studentId } of await studentService.studentsLesson(lesson.lessonId)) {
                await pubsubService.publishOnTeacherShowedRightAnswers(pubsub, lesson.lessonId, studentId, lessonAnswers);
            }
        }

        return !!upd[0];
    }

    async create(type, answerShown, sentences, attachments) {
        const task = await Task.create({ type, answerShown });
        const taskId = task.taskId;

        for (let { index, text, gaps } of sentences) {
            const newSentence = await sentenceService.create(index, text, gaps);

            await TaskSentence.create({ taskId, sentenceId: newSentence.sentenceId });
        }

        for (let {link, title, contentType} of attachments) {
            await TaskAttachments.create({ taskId, link, title, contentType});
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

    async getOneById(taskId) {
        return await Task.findOne({
            where: { taskId }
        });
    }

    async getOneByIdAndLessonId(taskId, lessonId) {
        return await Task.findOne({
            where: { taskId },
            include: {
                association: "taskTaskListTask",
                include: {
                    association: "taskListTaskTaskList",
                    include: {
                        association: "taskListLesson",
                        where: { lessonId },
                        required: true,
                    },
                    required: true,
                },
                required: true,
            }
        });
    }
}

module.exports = new TaskService();
