const { Student} = require('../../models');
const {UserRoleEnum} = require("../../utils");


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
}


module.exports = new StudentService();
