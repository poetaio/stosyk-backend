const studentService = require('../services/studentService');

class StudentController {
    async create({ name }) {
        return await studentService.create(name);
    }

    async getOne({ id }) {
        return await studentService.getOneById(id);
    }
}

module.exports = new StudentController();
