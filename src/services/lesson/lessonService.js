const { Lesson, LessonTeacher, TaskList, TaskListTask} = require('../../models');
const { LessonTypeEnum, DBError, NotFoundError, ValidationError} = require('../../utils');
const teacherService = require('../user/teacherService');
const taskService = require('./taskService');
const { sequelize } = require("../../models");
const {DELETE_BY_TEACHER_ID} = require("../../models/queries/lessonQueries");


class LessonService {
    async teacherLessonExists(lessonId, teacherId){
        return await LessonTeacher.count({
            where: {
                lessonId,
                teacherId
            }
        })
    }

    async deleteById(lessonId) {
        const res = await Lesson.destroy({
            where: { lessonId }
        });
        return !!res[0];
    }

    async deleteByTeacherId(teacherId) {
        console.log(teacherId);
        const res = await sequelize.query(DELETE_BY_TEACHER_ID, {
            replacements: { teacherId }
        });

        return !!res[0];
    }

    async create({ name, tasks }, userId) {
        // check if right option exists for every gap
        for (let task of tasks) {
            for (let sentence of task.sentences) {
                for (let gap of sentence.gaps) {
                    if (!gap.options.some(x => x.isCorrect))
                        throw new ValidationError(`No right option provided`);
                }
            }
        }

        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} not found`);

        // check anonymous
        if (await teacherService.existsAnonymousById(teacher.teacherId))
            await this.deleteByTeacherId(teacher.teacherId);

        const newLesson = await Lesson.create({ name });

        for (let { answerShown, sentences } of tasks) {
            const newTask = await taskService.create(answerShown, sentences);

            const taskList = await TaskList.create({ lessonId: newLesson.lessonId });
            await TaskListTask.create({ taskListId: taskList.taskListId, taskId: newTask.taskId });
        }

        await LessonTeacher.create({ teacherId: teacher.teacherId, lessonId: newLesson.lessonId })
        return newLesson.lessonId;
    }

    async startLesson(lessonId, teacherId) {
        if (!await this.teacherLessonExists(lessonId, teacherId))
            throw new NotFoundError(`No lesson ${lessonId} of such teacher ${teacherId}`);

        try {
            await Lesson.update({
                status: LessonTypeEnum.ACTIVE
            }, {
                where: {
                    lessonId
                }
            });
            return true;
        } catch (e) {
            throw new DBError();
        }
    }

    async finishLesson(lessonId, teacherId) {
        if(!await this.teacherLessonExists(lessonId, teacherId)) {
            throw new NotFoundError(`No lesson ${lessonId} of such teacher ${teacherId}`);
        }
        try {
            await Lesson.update({
                status: LessonTypeEnum.PENDING
            }, {
                where: {
                    lessonId
                }
            })
            return true;
        } catch (e){
            throw new DBError();
        }
    }

    async deleteLesson(lessonId, teacherId) {
       if(!await  this.teacherLessonExists(lessonId, teacherId)){
           throw new NotFoundError(`No lesson ${lessonId} of such teacher ${teacherId}`);
       }
        try {
            await Lesson.destroy({
                where: {
                    lessonId
                }
            })
            return true;
       }catch(e){
           throw new DBError();
       }
    }
}

module.exports = new LessonService();
