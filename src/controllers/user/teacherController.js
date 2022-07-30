const { teacherService, tokenService} = require('../../services');
const {schoolService} = require("../../services/school");

class TeacherController {
    async createAnonymous() {
        const {teacherId, user: {userId}} = await teacherService.createAnonymous();
        await schoolService.create(teacherId);
        const token = tokenService.createTeacherToken(userId);

        return { token };
    }
}


module.exports = new TeacherController();
