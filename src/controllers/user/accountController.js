const { accountService, tokenService, teacherService, userService, studentService} = require('../../services')
const bcrypt = require('bcrypt');
const {UnauthorizedError, ValidationError, UserRoleEnum} = require("../../utils");
const {REGISTERED} = require("../../utils/enums/UserType.enum");
const {schoolService} = require("../../services/school");
const accountStatusEnum = require('../../utils/enums/accountStatus.enum')
const jwt = require("jsonwebtoken");

class AccountController {

    async registerUser({user: {role, name, email, password, avatar_source}}, {userId}) {

        if (await accountService.existsByLogin(email))
            throw new ValidationError(`User with login ${email} already exists`);

        if (userId) {
            const user = await userService.findOneByUserId(userId);
            if (user.type === REGISTERED)
                throw new ValidationError(`User is already registered`);
            else if (role === UserRoleEnum.STUDENT) {
                await studentService.updateAnonymousStudentToRegistered(userId, email, password, name, avatar_source);
            } else {
                await teacherService.updateAnonymousTeacherToRegistered(userId, email, password, name, avatar_source);
            }
        } else {
            if (role === UserRoleEnum.STUDENT) {
                const userToProceed = await studentService.create(email, password, name, avatar_source);
                userId = userToProceed.user.userId;
            } else {
                const userToProceed = await teacherService.create(email, password);
                await schoolService.create(userToProceed.teacherId);
                userId = userToProceed.user.userId;
            }
        }

        if (role === UserRoleEnum.STUDENT) {
            const token = await tokenService.createStudentToken(userId);
            return {token};
        } else {
            const token = await tokenService.createTeacherToken(userId);
            return {token};
        }
    }

    async loginUser({ user: { email, password } }) {
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
        const res = {
            role: user.role,
            email: account.account.login,
            avatar_source: account.account.avatar_source,
            name: user.name
        }
        return res
    }

    async changePassword({oldPassword, newPassword}, {user:{userId}}){
        const account = await accountService.getOneById(userId)
        if (!account || !bcrypt.compareSync(oldPassword, account.account.passwordHash)) {
            throw new ValidationError('Wrong password');
        }
        return await accountService.changePassword(userId,  newPassword)
    }

    async changeEmail({newEmail, password}, {user: {userId}}){
        const account = await accountService.getOneById(userId)
        if (!account || !bcrypt.compareSync(password, account.account.passwordHash)) {
            throw new ValidationError('Wrong password');
        }
        return await accountService.changeEmail(userId,  newEmail)

    }

    async changeName({newName}, {user: {userId}}){
        return await accountService.changeName(userId,  newName)
    }

    async changeAvatar({newAvatarSource}, {user: {userId}}){
        return await accountService.changeAvatar(userId,  newAvatarSource)
    }

    async anonymousAuth({ user: { userId, role } }) {
        if (!await userService.existsById(userId)) {
            throw new ValidationError(`No user with id ${userId} exists`);
        }

        // todo: add verification if anonymous

        let token;
        if (UserRoleEnum.TEACHER === role) {
            token = tokenService.createTeacherToken(userId);
        } else if (UserRoleEnum.STUDENT === role) {
            token = tokenService.createStudentToken(userId);
        }

        return { token };
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
