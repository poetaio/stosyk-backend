const {studentService, tokenService} = require("../services");

class StudentController {
    async createAnonymous({ name }) {
        const userId = await studentService.createAnonymous(name);
        const token = tokenService.createStudentToken(userId);

        return { token };
    }
}


module.exports = new StudentController();
