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
const Sequelize = require('sequelize');
const accountStatusEnum = require("../../utils/enums/accountStatus.enum");

class StudentService {
    async createAnonymous(name) {
        return await Student.create(
            { user: { role: UserRoleEnum.STUDENT, name}, },
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
                include: [[Sequelize.col('user.account.login'), 'login']]
            }
        }).then(student => student?.get({plain: true}));
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

    async create(email, password, name, avatar_source, automatic_verification) {
        const passwordHash = await hashPassword(password);

        let status = accountStatusEnum.UNVERIFIED
        if(automatic_verification && process.env.ENVIRONMENT==="DEV"){
            status = accountStatusEnum.VERIFIED
        }

        return await Student.create(
            {
                user: {
                    role: UserRoleEnum.STUDENT,
                    type: UserTypeEnum.REGISTERED,
                    name: name,
                    account: {
                        login: email,
                        passwordHash,
                        avatar_source,
                        status,
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
