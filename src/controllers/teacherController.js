const teacherService = require('../services/teacherService')


class TeacherController {
    async create() {
        return await teacherService.create();
    }

    async getOne({ id }) {
        return await teacherService.getOneById(id)
    }
}

module.exports = new TeacherController();
