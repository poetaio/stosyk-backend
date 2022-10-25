const { Teacher, User, Account} = require('../../db/models');
const {UserRoleEnum, UserTypeEnum, hashPassword} = require("../../utils");
const accountStatusEnum = require('../../utils/enums/accountStatus.enum')
const {teacherBySchoolIdInclude} = require("../../db/models/includes/user/teacher");

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

    async createAnonymous(name) {
        return await Teacher.create(
            { user: { name, role: UserRoleEnum.TEACHER } },
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
                    name,
                    account: {
                        login: email,
                        passwordHash,
                        avatar_source,
                        status,
                    }
                },
            },
            {
                include: {
                    association: 'user',
                    include: 'account'
                }
            }
        );
    }

    async findOneByUserId(userId) {
        return await Teacher.findOne({ where: { userId } });
    }

    async findOneByUserIdWithUser(userId) {
        return await Teacher.findOne({
            where: { userId },
            include: 'user',
        });
    }

    async findOneBySchoolIdWithUser(schoolId) {
        return await Teacher.findOne({
            include: [
                teacherBySchoolIdInclude(schoolId),
                'user',
            ],
        });
    }
}


module.exports = new TeacherService();
