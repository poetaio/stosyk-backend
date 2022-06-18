const { accountService, tokenService, teacherService, userService} = require('../../services')
const bcrypt = require('bcrypt');
const {UnauthorizedError, ValidationError} = require("../../utils");
const {REGISTERED} = require("../../utils/enums/UserType.enum");
const accountStatusEnum = require('../../utils/enums/accountStatus.enum')
const jwt = require("jsonwebtoken");

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

        if(account.status !== accountStatusEnum.VERIFIED){
            throw new ValidationError(`User is not verified`);
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

    async sendConfirmationEmail({login}){
        const account = await accountService.getOneByLogin(login)
        if(!account || account.status !== accountStatusEnum.UNVERIFIED){
            throw new UnauthorizedError('Invalid login');
        }
        return await accountService.sendVerificationCode(login)
    }

    async confirmEmail({confirmationCode}){
        let user = jwt.verify(confirmationCode, process.env.JWT_SECRET);
        user = await accountService.getOneByLogin(user.email)
        if(!user){
            throw new UnauthorizedError('Invalid code');
        }
        return await accountService.confirmEmail(user.login)
    }
}


    module.exports = new AccountController();
