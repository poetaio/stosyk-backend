const {tokenService, studentService, userService} = require("../../services");
const {ValidationError, UserRoleEnum} = require("../../utils");
const teacherService = require("../../services/user/teacherService");
const {schoolService} = require("../../services/school");

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

    async updateProfile({ userProfile: {name, avatar_url} }, { user: { userId }}) {
        const user = await userService.findOneByUserId(userId);

        if (!user){
            throw new ValidationError(`User with id ${userId} not found`);
        }

        return await userService.updateProfile(userId, name, avatar_url);
    }

    async createAnonymous({name, type}) {
        if(type === UserRoleEnum.TEACHER){
            const {teacherId, user: {userId}} = await teacherService.createAnonymous();
            await schoolService.create(teacherId);
            const token = tokenService.createTeacherToken(userId);

            return { token };
        }
        if(type === UserRoleEnum.STUDENT){
            const userId = await studentService.createAnonymous(name);
            const token = tokenService.createStudentToken(userId);

            return { token };
        }
    }


}




module.exports = new UserController();
