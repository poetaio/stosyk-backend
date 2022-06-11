const { accountService, tokenService, teacherService, userService} = require('../../services')
const bcrypt = require('bcrypt');
const {UnauthorizedError, ValidationError} = require("../../utils");
const {REGISTERED} = require("../../utils/enums/UserType.enum");

class AccountController {
    async registerTeacher({ teacher: { email, password } }, { userId }) {
        if (await accountService.existsByLogin(email))
            throw new ValidationError(`User with login ${email} already exists`);

        if (userId) {
            const user = await userService.findOneByUserId(userId);
            if (user.type === REGISTERED)
                throw new ValidationError(`User is already registered`);
            await teacherService.updateAnonymousTeacherToRegistered(userId, email, password);
        } else {
            const userToProceed = await teacherService.create(email, password);
            userId = userToProceed.user.userId;
        }

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

    async getAccountInfo({user: {userId}}) {
        const user = await userService.findOneByUserId(userId);
        if (user.type !== REGISTERED) {
            throw new ValidationError(`User is not registered`);
        }
        const account = await accountService.getOneById(userId)
        return account.account.login
    }

    async changePassword({oldPassword, newPassword}, {user:{userId}}){
        const account = await accountService.getOneById(userId)
        if (!account || !bcrypt.compareSync(oldPassword, account.account.passwordHash)) {
            throw new ValidationError('Wrong password');
        }
        return await accountService.changePassword(userId, account.account.login,  newPassword)
    }
}


    module.exports = new AccountController();
