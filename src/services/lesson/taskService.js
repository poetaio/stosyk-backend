const {Task, Lesson, TaskSentence} = require("../../models");
const lessonService = require('./lessonService');
const sentenceService = require('./sentenceService');
const {DBError, NotFoundError} = require('../../utils');


class TaskService {
    async teacherTaskExists(taskId, teacherId){
        const lesson = await Lesson.findOne({
            include: {
                association: 'taskList',
                include: {
                    association: 'taskListTaskListTask',
                    include: {
                        association: 'taskListTaskTask',
                        where: { taskId },
                        required: true
                    }
                }
            }
        });
        return await lessonService.teacherLessonExists(lesson.lessonId, teacherId)
    }
    
    async showAnswers(taskId, teacherId) {
        if (!await this.teacherTaskExists(taskId, teacherId)){
            throw new NotFoundError(`No task ${taskId} of such teacher ${teacherId}`);
        }
        try{
            await Task.update({
                answerShown: true
            },{
                where: {
                    taskId
                }
            })
            return true
        } catch(e){
            throw new DBError()
        }
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
                    }
                }
            }
        });
    }
}

module.exports = new TaskService();
