const lessonService = require('../services/lesson_constructor/lessonService');


class LessonController {
    async getAll({ authorId }) {
        return await lessonService.getAll(authorId);
    }

    async getOne({ authorId, id }) {
        return await lessonService.getOneByIdAndAuthorId(authorId, id);
    }

    async add({ authorId, tasks }) {
        return await lessonService.createWithAuthorIdAndTasks(authorId, tasks);
    }

    async deleteOne( { authorId, lessonId }) {
        return await lessonService.deleteOneByIdAndAuthorId(authorId, lessonId);
    }
}

module.exports = new LessonController();
