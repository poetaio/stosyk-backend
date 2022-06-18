const {Account, User} = require("../../models");
const {hashPassword, emailTransport} = require("../../utils");
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
        emailTransport.sendMail({
            from: "Stosyk",
            to: "princess.labadie16@ethereal.email",
            subject: "Please confirm your Stosyk account",
            html: `<h1>Email Confirmation</h1>
        <p>Please confirm your email by clicking on the following link</p>
        <a href=https://www.stosyk.app/confirm/${verificationCode}> Click here</a>
        </div>`,}).catch((err)=>{
            return false;
        })
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
