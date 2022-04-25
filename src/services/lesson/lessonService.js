const { Lesson, LessonTeacher, TaskList, TaskListTask} = require('../../models');
const { LessonTypeEnum, DBError, NotFoundError, ValidationError} = require('../../utils');
const teacherService = require('../user/teacherService');
const taskService = require('./taskService');
const { sequelize } = require("../../models");
const {DELETE_BY_TEACHER_ID} = require("../../models/queries/lessonQueries");
const Sequelize = require('sequelize');
const { Op } = Sequelize;


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
        const res = await sequelize.query(DELETE_BY_TEACHER_ID, {
            replacements: { teacherId }
        });

        return !!res[0];
    }

    async create({ name, tasks }, teacherId) {
        // check if right option exists for every gap
        for (let task of tasks) {
            for (let sentence of task.sentences) {
                for (let gap of sentence.gaps) {
                    if (!gap.options.some(x => x.isCorrect))
                        throw new ValidationError(`No right option provided`);
                }
            }
        }

        try {
            // check anonymous
            if (await teacherService.existsAnonymousById(teacherId))
                await this.deleteByTeacherId(teacherId);

            const newLesson = await Lesson.create({name});

            for (let {answerShown, sentences} of tasks) {
                const newTask = await taskService.create(answerShown, sentences);

                const taskList = await TaskList.create({lessonId: newLesson.lessonId});
                await TaskListTask.create({taskListId: taskList.taskListId, taskId: newTask.taskId});
            }

            await LessonTeacher.create({teacherId, lessonId: newLesson.lessonId})
            return newLesson.lessonId;
        } catch (e) {
            throw new DBError(e.message);
        }
    }

    async getTeacherLessons(teacherId, whereParam, page, limit) {
        const { lessonId, name } = whereParam || {};

        const and = [];

        if (lessonId) {
            and.push({ lessonId });
        }
        if (name) {
            and.push(
                Sequelize.where(
                    Sequelize.fn('lower', Sequelize.col('name')),
                    {
                        [Op.like]: `%${name.toLowerCase()}%`
                    }
                )
            )
        }
        const where = { [Op.and]: and };

        const options = {
            where,
            include: {
                association: 'lessonLessonTeacher',
                where: { teacherId },
                required: true
            }
        };

        page = page && 1;
        if (limit && limit > 0) {
            options.offset = (page - 1) * limit;
        }

        const countedLessons = await Lesson.findAndCountAll(options);

        return (({ count, rows }) => ({
            total: count,
            lessons: rows
        }))(countedLessons);
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
