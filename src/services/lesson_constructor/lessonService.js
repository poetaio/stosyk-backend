const {Lesson} = require("../../models");
const lessonInclude = require('../../models/includes/lessonInclude');
const lessonIncludeShort = require('../../models/includes/shortLessonInclude');
const shortLessonInclude = require("../../models/includes/shortLessonInclude");
const teacherService = require('../teacherService');
const ApiError = require("../../error/ApiError");
const taskService = require('./taskService');


class LessonService {
    async existsById(lessonId) {
        return !!await Lesson.count({ where: { id: lessonId } });
    }

    // returns full lesson object, if one exists, with tasks-gaps-options-rightOption
    async getOneById(id) {
        return await Lesson.findOne({
            where: { id },
            include: lessonInclude
        });
    }

    async getOneByIdShort(lessonId) {
        return await Lesson.findOne({
            where: { id: lessonId },
            include: lessonIncludeShort
        });
    }

    async getAll({ authorId }) {
        const where = {};

        if (authorId)
            where.authorId = authorId;

        const countedLessons = await Lesson.findAndCountAll({
            ...where,
            include: shortLessonInclude
        });
        return {
            total: countedLessons.count,
            lessonsList: countedLessons.rows
        };
    }

    // for future:
    // in tasks' tasks/gaps/options list two options possible:
    // provide id       - to put existing value by fk in db
    // provide the whole entity with options list and rightOption   - to create new entity
    async createWithAuthorIdAndTasks(authorId, tasks) {
        if (!await teacherService.exists(authorId))
            throw ApiError.badRequest(`No author with id ${authorId}`);

        // convert object to either single id or object with gaps and text
        // const tasksToInsert = tasks.map(({ id, gaps, text }) => (
        //     id
        //         ? await taskService.getOneByIdForTeacher(id)
        //         : { gaps, text }
        // )).filter((task) => task !== null);

        const newLesson = await Lesson.create({
            authorId
        });

        // custom creating as need to sync rightOptionId and newly created options
        for (let { name, description, text, gaps } of tasks)
            await taskService.createWithValues(newLesson.id, name, description, text, gaps);

        return await Lesson.findOne({
            where: { id: newLesson.id },
            include: lessonInclude
        });
    }
}

module.exports = new LessonService();
