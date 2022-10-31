const {hashPassword, emailTransport, logger} = require("../../utils");
const {Account, User} = require("../../db/models");
const emailFactoryService = require('../email/emailFactoryService')
const accountStatusEnum = require('../../utils/enums/accountStatus.enum')
const jwt = require("jsonwebtoken");

class AccountService {
    async getOneByLogin(login) {
        return await Account.findOne({
            where: { login },
            include: 'user'
        });
    }

    async existsByLogin(login) {
        return !!await Account.count({
            where: { login }
        });
    }

    async getOneById(userId) {
        return await User.findOne({
            where: { userId },
            include: 'account'
        })
    }

    async changePassword(userId, newPassword){
        const passwordHash = await hashPassword(newPassword);
        const upd = await Account.update({
            passwordHash
         },{
            where: {
             userId
            }
        })
        return !!upd[0]
    }

    async changeEmail(userId, newEmail){
        const upd = await Account.update({
            status: accountStatusEnum.UNVERIFIED ,
            login: newEmail
        }, {
            where: {
                userId
            }
        })
         await Account.update({
            status: accountStatusEnum.UNVERIFIED
        },{
            where:
                {
                    userId
                }
        })
        return !!upd[0]
    }

    async changeName(userId, newName){
        const upd = await User.update({
            name: newName
        }, {
            where: {
                userId
            }
        })
        return !!upd[0]
    }

    async changeAvatar(userId, newAvatarSource){
        const upd = await Account.update({
            avatar_source: newAvatarSource
        }, {
            where: {
                userId
            }
        })
        return !!upd[0]
    }

    async sendVerificationCode(email){
        const verificationCode = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        await emailTransport.sendMail(await emailFactoryService.createConfirmationEmail(email, verificationCode), function (err,info) {
            if (err) {
                throw err
            }
        });
        if ("production" !== process.env.NODE_ENV) {
            logger.debug(`Sent verification code to email ${email}: ${verificationCode}`)
        }
        return true
    }

    async confirmEmail(login){
        const upd = await Account.update({
            status: accountStatusEnum.VERIFIED
        },{
            where:
                {
                   login
                }
        })
        return !!upd[0]
    }

    async sendResetPassEmail(email){
        const resetPassCode = jwt.sign(
            { email, "type":"resetpass" },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        await emailTransport.sendMail(await emailFactoryService.createResetPassEmail(email, resetPassCode), function (err,info) {
            if(err)
            {
                throw err
            }
        });
        return true
    }
}

module.exports = new AccountService();
