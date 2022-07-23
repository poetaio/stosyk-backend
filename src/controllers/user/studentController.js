const {studentService, tokenService} = require("../../services");
const {ValidationError} = require("../../utils");

class StudentController {
    async createAnonymous({ name }) {
        const userId = await studentService.createAnonymous(name);
        const token = tokenService.createStudentToken(userId);

        return { token };
    }

    async updateProfile({ name }, { user: { userId }}) {
        const student = await studentService.findOneByUserId(userId);

        if (!student){
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        return await studentService.updateProfile(student.studentId, name);
    }
}


module.exports = new StudentController();
