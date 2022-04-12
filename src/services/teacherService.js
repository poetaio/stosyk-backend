const {Teacher} = require("../models");


class TeacherService {
    async exists(teacherId) {
        return !!await Teacher.count({ where: { id: teacherId } });
    }

    async create() {
        return await Teacher.create();
    }

    async getOneById(teacherId) {
        return await Teacher.findOne({ where: { id: teacherId } });
    }
}

module.exports = new TeacherService();
