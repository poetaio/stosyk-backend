const { Teacher, User, Account} = require('../../db/models');
const {UserRoleEnum, UserTypeEnum, hashPassword} = require("../../utils");
const accountStatusEnum = require('../../utils/enums/accountStatus.enum')

class TeacherService {
    async existsAnonymousById(teacherId) {
        return !!await Teacher.count({
            where: { teacherId },
            include: {
                association: 'user',
                where: {
                    type: UserTypeEnum.ANONYMOUS
                },
                required: true
            }
        });
    }

    async createAnonymous() {
        return await Teacher.create(
            { user: { role: UserRoleEnum.TEACHER } },
            { include: 'user' }
        );
    }

    async create(email, password, name, avatar_source, automatic_verification) {
        const passwordHash = await hashPassword(password);

        let status = accountStatusEnum.UNVERIFIED
        if(automatic_verification && process.env.ENVIRONMENT==="DEV"){
            status = accountStatusEnum.VERIFIED
        }

        return await Teacher.create({
                user: {
                    role: UserRoleEnum.TEACHER,
                    type: UserTypeEnum.REGISTERED,
                    account: {
                        login: email,
                        passwordHash,
                        avatar_source,
                        status,
                    }
                }, name
            },
            {
                include: {
                    association: 'user',
                    include: 'account'
                }
            }
        );
    }

    async updateAnonymousTeacherToRegistered(userId, email, password, name, avatar_source, automatic_verification) {
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

    async findOneByUserId(userId) {
        return await Teacher.findOne({ where: { userId } });
    }
}


module.exports = new TeacherService();
