const { Lesson, User} = require('../models/index');
const ApiError = require('../error/ApiError');

class LessonController {
    async getAll(args) {
        const { authorId } = args;
        const where = {};

        if (authorId)
            where.authorId = authorId;

        const countedLessons = await Lesson.findAndCountAll({ ...where });
        return {
            total: countedLessons.count,
            lessonsList: countedLessons.rows
        };
    }

    async getOneById(id) {
        return await Lesson.findOne({ where: { id } });
    }

    async add(args) {
        const { authorId } = args;

        // checking foreign key
        if (!await User.findOne({ where: { id: authorId } })) {
            throw ApiError.badRequest(`No user with id ${authorId}`);
        }

        return await Lesson.create({ authorId });
    }
}

module.exports = new LessonController();
