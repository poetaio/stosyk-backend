const { accountService, tokenService, teacherService} = require('../../services')
const bcrypt = require('bcrypt');
const {UnauthorizedError, ValidationError} = require("../../utils");
const {LessonTeacher} = require("../../models");

class AccountController {
    async registerTeacher({ teacher: { email, password } }, { user: { userId } }) {
        if (await accountService.existsByLogin(email))
            throw new ValidationError(`User with login ${email} already exists`);

        const teacher = await teacherService.findOneByUserId(userId);
        const newUser = await teacherService.create(email, password);

        await LessonTeacher.update({
                teacherId: newUser.teacherId
            },
            {
                where: {
                    teacherId: teacher.teacherId
                }
            })

        const token = await tokenService.createTeacherToken(newUser.user.userId);
        return { token };
    }

    async loginTeacher({ teacher: { email, password } }) {
        const account = await accountService.getOneByLogin(email);

        if (!account || !bcrypt.compareSync(password, account.passwordHash)) {
            throw new UnauthorizedError('Invalid login or password');
        }

        const token = await tokenService.createToken(account.user.userId, account.user.role);
        return { token };
    }
}


    module.exports = new AccountController();
