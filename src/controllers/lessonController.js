const lessonService = require('../services/lesson_constructor/lessonService');


class LessonController {
    async getAll({ filters }) {
        return await lessonService.getAll(filters);
    }

    async getOneById({ id }) {
        return await lessonService.getOneById(id);
    }

    async add({ authorId, tasks }) {
        return await lessonService.createWithAuthorIdAndTasks(authorId, tasks);
    }
}

module.exports = new LessonController();
