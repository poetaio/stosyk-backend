const { accountService, tokenService, teacherService, userService, studentService} = require('../../services')
const bcrypt = require('bcrypt');
const {UnauthorizedError, ValidationError, UserRoleEnum} = require("../../utils");
const {REGISTERED} = require("../../utils/enums/UserType.enum");
const {schoolService} = require("../../services/school");
const accountStatusEnum = require('../../utils/enums/accountStatus.enum')
const jwt = require("jsonwebtoken");

class AccountController {

    async registerUser({user: {role, name, email, password, avatar_source, automatic_verification}}, {userId}) {

        if(automatic_verification === null)
            automatic_verification = false

        if (await accountService.existsByLogin(email))
            throw new ValidationError(`User with login ${email} already exists`);

        if (userId) {
            const user = await userService.findOneByUserId(userId);
            if (user.type === REGISTERED)
                throw new ValidationError(`User is already registered`);
            else {
                await userService.updateAnonumousToRegistered(userId, email, password, name, avatar_source, automatic_verification)
            }
            const account = await accountService.getOneByLogin(email)
            if(account.status === accountStatusEnum.UNVERIFIED){
                await this.sendConfirmationEmail({login: email});
            }
        } else {
            let userToProceed;
            if (role === UserRoleEnum.STUDENT) {
                userToProceed = await studentService.create(email, password, name, avatar_source, automatic_verification);
                userId = userToProceed.user.userId;
            } else {
                userToProceed = await teacherService.create(email, password, name, avatar_source, automatic_verification);
                await schoolService.create(userToProceed.teacherId);
                userId = userToProceed.user.userId;
            }

            if(userToProceed.user.account.status === accountStatusEnum.UNVERIFIED) {
                await this.sendConfirmationEmail({login: userToProceed.user.account.login});
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

    async getUserInfo({user: {userId}}) {
        const user = await userService.findOneByUserId(userId);
        let account
        if (user.type === REGISTERED) {
            account = await accountService.getOneById(userId)
        }
        const res = {
            role: user.role,
            email: account?.account?.login || null,
            avatar_source: account?.account?.avatar_source || null,
            name: user.name || null,
            registered: user.type === REGISTERED
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
        if(await accountService.existsByLogin(newEmail)){
            throw new ValidationError(`User with email ${newEmail} already exists`);
        }
        await accountService.changeEmail(userId,  newEmail)

        await this.sendConfirmationEmail({login: newEmail});

        return true;
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
        let user
        try {
            user = jwt.verify(confirmationCode, process.env.JWT_SECRET);
        } catch (e) {
            throw new UnauthorizedError(e.message);
        }
        user = await accountService.getOneByLogin(user.email)
        if(!user){
            throw new UnauthorizedError('Invalid code');
        }
        return await accountService.confirmEmail(user.login)
    }

    async sendResetPassEmail({login}){
        const account = await accountService.getOneByLogin(login)
        if(!account){
            throw new UnauthorizedError('Invalid login');
        }
        return await accountService.sendResetPassEmail(login)
    }

    async resetPassword({resetPassCode, password}){
        let user
        try {
            user = jwt.verify(resetPassCode, process.env.JWT_SECRET);
        } catch (e) {
            throw new UnauthorizedError(e.message);
        }
        if(user.type !== "resetpass"){
            throw new ValidationError("Wrong type of token");
        }
        user = await accountService.getOneByLogin(user.email)
        if(!user) {
            throw new UnauthorizedError('Invalid code');
        }
        return await accountService.changePassword(user.userId, password)
    }
}


module.exports = new AccountController();
