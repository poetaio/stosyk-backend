const {hashPassword, emailTransport, UnauthorizedError} = require("../../utils");
const {Account, User} = require("../../db/models");
const {where} = require("sequelize");
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

    async changePassword(userId, login, newPassword){
        const passwordHash = await hashPassword(newPassword);
        const upd = await Account.update({
            passwordHash
         },{
            where: {
             login
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
        const mailOptions = {
            from: "info@stosyk.app",
            to: email,
            subject:"Please confirm your Stosyk account" ,
            html: `<h1>Email Confirmation</h1>
        <p>Here is your confirmation code:</p>
         <p>${verificationCode}</p>
        </div>`
        }
        await emailTransport.sendMail(mailOptions, function (err,info) {
            if(err)
            {
                return false
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
