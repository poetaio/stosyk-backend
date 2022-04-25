const { accountService, tokenService, teacherService} = require('../../services')
const bcrypt = require('bcrypt');
const {UnauthorizedError, ValidationError} = require("../../utils");

class AccountController {
    async registerTeacher({ teacher: { email, password } }) {
        if (await accountService.existsByLogin(email))
            throw new ValidationError(`User with login ${email} already exists`);

        const userId = await teacherService.create(email, password);

        const token = await tokenService.createTeacherToken(userId);
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
