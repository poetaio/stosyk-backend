const {UserRoleEnum} = require("../../utils");
const jwt = require('jsonwebtoken');

class TokenService {
    static async generateJwt(userId, role) {
        return jwt.sign(
            { userId, role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }

    async createToken(userId, role) {
        if (role !== UserRoleEnum.TEACHER && role !== UserRoleEnum.STUDENT)
            throw new Error(`Invalid value for user role: ${role}`);

        return await TokenService.generateJwt(userId, role);
    }

    async createTeacherToken(userId) {
        return await this.createToken(userId, UserRoleEnum.TEACHER);
    }

    async createStudentToken(userId) {
        return await this.createToken(userId, UserRoleEnum.STUDENT);
    }

    async createSchoolStudentInviteToken(email) {
        return jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }
}


module.exports = new TokenService();
