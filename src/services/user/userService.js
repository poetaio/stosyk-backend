const {User, Account} = require("../../db/models");
const accountService = require("./accountService");
const {hashPassword, UserTypeEnum} = require("../../utils");
const accountStatusEnum = require("../../utils/enums/accountStatus.enum");

class UserService {
    async findOneByUserId(userId) {
        return await User.findOne({
            where:
                {
                    userId
                }
        });
    }

    async existsById(userId) {
        return !!await User.count({
            where: { userId }
        });
    }

    async updateProfile(userId, name, avatar_url){
        let upd
        if(name){
            upd = await User.update({
                name
            }, {
                where: {userId}
            })
        }
        if(avatar_url){
            const account = await accountService.getOneById(userId)
            if(account) {
                upd = await Account.update({
                    name
                }, {
                    where: {accountId: account.accountId}
                })
            }
        }

        return !!upd[0]
    }

    async updateAnonumousToRegistered(userId, email, password, name, avatar_source, automatic_verification){
        const passwordHash = await hashPassword(password);


        await User.update({
                type: UserTypeEnum.REGISTERED,
                name: name
            },
            {
                where: {
                    userId
                }
            }
        );

        let status = accountStatusEnum.UNVERIFIED
        if(automatic_verification && process.env.ENVIRONMENT==="DEV"){
            status = accountStatusEnum.VERIFIED
        }

        await Account.create({
            login: email,
            passwordHash,
            userId,
            avatar_source,
            status
        })
    }
}

module.exports = new UserService();
