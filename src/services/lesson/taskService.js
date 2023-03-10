const {Task, Lesson, TaskSentence,
    sequelize,
    DELETE_TASK_BY_LESSON_ID,
    DELETE_SENTENCES_BY_TASK_ID,
    DELETE_GAPS_BY_SENTENCE_ID,
    DELETE_OPTIONS_BY_GAP_ID, taskWithLessonInclude, TaskAttachments, TaskListTask, allTasksByLessonIdInclude
} = require("../../db/models");
const sentenceService = require('./sentenceService');
const {NotFoundError, ValidationError, LessonStatusEnum, TaskTypeEnum, TaskListTypeEnum} = require('../../utils');
const studentService = require("../user/studentService");
const pubsubService = require("../pubsubService");
const lessonAnswersService = require("./lessonAnswersService");
const lessonByTeacherAndTaskInclude = require("../../db/models/includes/lesson/lessonByTeacherAndTask.include");
const studentLessonService = require("./studentLessonService");

class TaskService {
    // todo: existsWithAnswerShown
    async teacherTaskExists(taskId, teacherId){
        return !!await Lesson.count({
            include: lessonByTeacherAndTaskInclude(teacherId, taskId),
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
                        association: 'lesson',
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
            const lesson = task.taskTaskListTask.taskListTaskTaskList.lesson;
            const lessonAnswers = await lessonAnswersService.getShownAnswers(lesson.lessonId);
            const students = await studentLessonService.getLessonStudents(lesson.lessonId);
            for (let { studentId } of students) {
                await pubsubService.publishOnTeacherShowedRightAnswers(pubsub, lesson.lessonId, studentId, lessonAnswers);
            }
        }

        return !!upd[0];
    }

    // Converting type object (plainInput, qa...) fields to structure -> sentence-gap-option
    // in order to save them through common interface
    async getSentencesFromTypeObject(task) {
        const { type } = task;

        if (type === TaskTypeEnum.MULTIPLE_CHOICE) {
            return task.multipleChoice.sentences;
        } else if (type === TaskTypeEnum.PLAIN_INPUT) {
            return task.plainInput.sentences;
        } else if (type === TaskTypeEnum.MEDIA) {
            return [];
        }

        let sentences;
        // QA type: questions-answers
        if (type === TaskTypeEnum.QA) {
            sentences = [];
            for (let question of task.qa.questions || []) {
                const { index, text, options } = question;
                const newSentence = {
                    index,
                    text,
                    gaps: [{
                        position: 0,
                        options
                    }],
                };
                sentences.push(newSentence);
            }
        // Matching type: sentences-correctOption
        } else if (type === TaskTypeEnum.MATCHING) {
            // each sentence has one gap, which contains one right option
            // todo: check if every "right column position" is used and all values in acceptable boundaries
            sentences = task.matching.sentences.map(({ index, text, correctOption : { value, rightColumnPosition } }) => ({
                index,
                text,
                gaps: [{
                    position: rightColumnPosition,
                    options: [{
                        value: value,
                        isCorrect: true,
                    }]
                }]
            }));
        } else throw new ValidationError(`No such task type: ${type}`);

        return sentences;
    }

    // task appear as they are in db (sentences->gaps->options)
    async createRaw(description, type, answerShown, sentences, attachments) {
        const createdTask = await Task.create({ type, answerShown, description });
        const {taskId} = createdTask;

        // creating sentence and connecting to task
        for (let { index, text, gaps } of sentences) {
            const newSentence = await sentenceService.create(index, text, gaps);

            await TaskSentence.create({ taskId, sentenceId: newSentence.sentenceId });
        }

        for (let {source, title, contentType} of attachments) {
            await TaskAttachments.create({ taskId, source, title, contentType});
        }

        return taskId;
    }

    // task creation, accepts all types of task as they are in GraphQL
    // with type and type object (e.g. "PLAIN_INPUT" and plainInput)
    async create(task) {
        const {type, answerShown, attachments, description} = task;

        // getting sentences from "type object" depending on type to insert in db
        let sentences = await this.getSentencesFromTypeObject(task);

        return await this.createRaw(description, type, answerShown, sentences, attachments);
    }

    async getAll({ lessonId, homeworkId }) {
        if (homeworkId) {
            return await Task.findAll({
                include: {
                    association: 'taskList',
                    include: {
                        association: 'homework',
                        where: {homeworkId},
                        required: true
                    },
                    required: true
                }
            });
        }

        return await Task.findAll({
            include: {
                association: 'taskList',
                required: true,
                attributes: [],
                include: {
                    association: 'lesson',
                    attributes: [],
                    required: true,
                    where: {lessonId},
                },
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

    async checkForCorrectOptionPresence(task) {
        let sentences;
        if (task.type === TaskTypeEnum.MULTIPLE_CHOICE) {
            sentences = task.multipleChoice.sentences;
        } else if (task.type === TaskTypeEnum.PLAIN_INPUT) {
            sentences = task.plainInput.sentences;
        } else if (task.type === TaskTypeEnum.QA) {
            const questions = task.qa.questions;
            for (let question of questions) {
                if (!question.options.some(({isCorrect}) => isCorrect)) {
                    throw new ValidationError(`No correct option provided for question`);
                }
            }
            return;
        } else if (task.type === TaskTypeEnum.MATCHING) {
            // always true, because each sentence has non null graphql field "correctOption"
            return;
        } else if (task.type === TaskTypeEnum.MEDIA) {
            return;
        } else throw new ValidationError(`No such task type: ${task.type}`);

        for (let sentence of sentences) {
            if (!sentence.text?.length || sentence.text?.length > 1500) {
                throw new ValidationError(`Sentence length must be 0-1500 characters`);
            }

            for (let gap of sentence.gaps) {
                if (!gap.options.some(option => option.isCorrect)) {
                    throw new ValidationError(`No correct option provided`);
                }
            }
        }
    }

    // tasks appear as in GraphQL with type and type object (e.g. "PLAIN_INPUT" and plainInput)
    async createTaskListTasks(taskListId, tasks) {
        // create and connect to lesson
        for (const task of tasks || []) {
            const taskId = await this.create(task);

            await TaskListTask.create({taskListId: taskListId, taskId});
        }
    }

    // tasks appear as in db (sentences->gaps->option)
    async createTaskListRawTasks(taskListId, tasks) {
        // create and connect to lesson
        for (const {description, type, answerShown, sentences, attachments} of tasks || []) {
            const taskId = await this.createRaw(description, type, answerShown, sentences, attachments);

            await TaskListTask.create({taskListId: taskListId, taskId});
        }
    }
}

module.exports = new TaskService();
