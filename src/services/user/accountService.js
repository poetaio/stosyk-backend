const {hashPassword, emailTransport} = require("../../utils");
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

    async sendVerificationCode(email){
        const verificationCode = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        await emailTransport.sendMail(await emailFactoryService.createConfirmationEmail(email, verificationCode), function (err,info) {
            if(err)
            {
                throw err
            }
        });
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
}

module.exports = new AccountService();
