const {userService, tokenService, studentService} = require("../../services");
const {UserTypeEnum, ValidationError} = require("../../utils");
const teacherService = require("../../services/user/teacherService");

class UserController {
    async checkTeacherAuth({ user: { userId } }) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher)
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);

        const token = await tokenService.createTeacherToken(userId);
        return {token};
    }

    async checkStudentAuth({ user: { userId } }) {
        const student = await studentService.findOneByUserId(userId);

        if(!student){
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        const token = await tokenService.createStudentToken(userId);
        return {token};
    }

    async isRegistered({user: {userId}}){
        const user = await userService.findOneByUserId(userId);
        return user.type === UserTypeEnum.REGISTERED
    }
}




module.exports = new UserController();
