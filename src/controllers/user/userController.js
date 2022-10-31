const {tokenService, studentService} = require("../../services");
const {ValidationError} = require("../../utils");
const teacherService = require("../../services/user/teacherService");

class UserController {
    async updateUserAuth({ user: { userId } }) {
        const teacher = await teacherService.findOneByUserId(userId);
        let token
        if (teacher) {
            token = await tokenService.createTeacherToken(userId);
        }else {
            const student = await studentService.findOneByUserId(userId)
            if (student) {
                token = await tokenService.createStudentToken(userId);
            }
            else {
                throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
            }
        }

        return {token};
    }


}




module.exports = new UserController();
