const { Teacher } = require('../models');
const {UserRoleEnum} = require("../utils");


class TeacherService {
    async createAnonymous() {
        return await Teacher.create(
            { user: { role: UserRoleEnum.TEACHER } },
            { include: 'user' }
        ).then(({ user }) => user.userId);
    }
}


module.exports = new TeacherService();
