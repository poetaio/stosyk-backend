const {Student} = require("../models");


class StudentService {
    async exists(studentId) {
        return !!await Student.count({ where: { id: studentId } });
    }

    async create(name) {
        return await Student.create({ name });
    }

    async getOneById(id) {
        return await Student.findOne({ where: { id } });
    }
}

module.exports = new StudentService();
