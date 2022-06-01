const { Teacher, User, Account} = require('../../models');
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
        ).then(({ user }) => user.userId);
    }

    async create(email, password) {
        const passwordHash = await hashPassword(password);

        return await Teacher.create({
                user: {
                    role: UserRoleEnum.TEACHER,
                    type: UserTypeEnum.REGISTERED,
                    account: {
                        login: email, passwordHash
                    }
                }
            },
            {
                include: {
                    association: 'user',
                    include: 'account'
                }
            }
        );
    }

    async updateAnonymousTeacherToRegistered(userId, email, password) {
        const passwordHash = await hashPassword(password);

        await User.update({
                type: UserTypeEnum.REGISTERED,
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
            userId
        })
    }

    async findOneByUserId(userId) {
        return await Teacher.findOne({ where: { userId } });
    }

    async findOneByLessonId(lessonId) {
        return await Teacher.findOne({
            include: {
                association: 'teacherLessonTeachers',
                where: { lessonId },
                required: true
            }
        });
    }
}


module.exports = new TeacherService();
