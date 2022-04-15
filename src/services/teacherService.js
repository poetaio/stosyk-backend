const {Teacher} = require("../models");


class TeacherService {
    async exists(teacherId) {
        return !!await Teacher.count({ where: { id: teacherId } });
    }

    async create() {
        return await Teacher.create();
    }

    async getOneById(id) {
        return await Teacher.findOne({ where: { id } });
    }
}

module.exports = new TeacherService();
