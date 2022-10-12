const { Teacher, User, Account} = require('../../db/models');
const {UserRoleEnum, UserTypeEnum, hashPassword} = require("../../utils");


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

    async create(email, password, name, avatar_source) {
        const passwordHash = await hashPassword(password);

        return await Teacher.create({
                user: {
                    role: UserRoleEnum.TEACHER,
                    type: UserTypeEnum.REGISTERED,
                    account: {
                        login: email,
                        passwordHash,
                        avatar_source
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

    async updateAnonymousTeacherToRegistered(userId, email, password, name, avatar_source) {
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

        await Account.create({
            login: email,
            passwordHash,
            userId,
            avatar_source
        })
    }

    async findOneByUserId(userId) {
        return await Teacher.findOne({ where: { userId } });
    }
}


module.exports = new TeacherService();
