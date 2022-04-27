const { teacherService, tokenService} = require('../../services');

class TeacherController {
    async createAnonymous() {
        const userId = await teacherService.createAnonymous();
        const token = tokenService.createTeacherToken(userId);

        return { token };
    }
}


module.exports = new TeacherController();
