const {Account, User} = require("../../db/models");
const {hashPassword} = require("../../utils");

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
        return !!upd[0]
    }
}

module.exports = new AccountService();
