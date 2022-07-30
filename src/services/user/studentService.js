const {
    Student,
    User,
    Account,
    Teacher,
    studentEmailInclude,
} = require('../../db/models');
const {
    UserRoleEnum,
    hashPassword,
    UserTypeEnum
} = require("../../utils");


class StudentService {
    async createAnonymous(name) {
        return await Student.create(
            { user: { role: UserRoleEnum.STUDENT }, name },
            { include: 'user' },
        ).then(({ user }) => user.userId);
    }

    async findOneByUserId(userId) {
        return await Student.findOne({ where: { userId } });
    }

    async findOneByUserIdWithLogin(userId) {
        return await Student.findOne({
            where: {userId},
            include: studentEmailInclude,
            attributes: {
                include: [['user.account.login', 'login']]
            }
        })
    }

    async studentsLesson(lessonId){
        return await Student.findAll({
            include: {
                association: 'studentLessons',
                where: {lessonId},
                required: true
            }
        })
    }

    async updateProfile(studentId, name) {
        const upd = await Student.update({
            name,
        }, {
            where: { studentId },
        });

        return !!upd[0];
    }

    async updateAnonymousStudentToRegistered(userId, email, password, name, avatar_source) {
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

    async create(email, password, name, avatar_source) {
        const passwordHash = await hashPassword(password);
        return await Student.create(
            {
                user: {
                    role: UserRoleEnum.STUDENT,
                    type: UserTypeEnum.REGISTERED,
                    name: name,
                    account: {
                        login: email, passwordHash,
                        avatar_source
                    }
                },
                name
            },
            {
                include: {
                    association: 'user',
                    include: 'account'
                }
            }
        );
    }
}


module.exports = new StudentService();
