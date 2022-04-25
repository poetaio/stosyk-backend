const { Teacher } = require('../../models');
const {UserRoleEnum, UserTypeEnum} = require("../../utils");


class TeacherService {
    async existsAnonymousById(teacherId) {
        return !!Teacher.count({
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

    async findOneByUserId(userId) {
        return await Teacher.findOne({ where: { userId } });
    }
}


module.exports = new TeacherService();
