const teacherService = require("../../services/user/teacherService");
const {ValidationError} = require("../../utils");
const {schoolService, invitationService} = require("../../services/school");
const {studentService} = require("../../services");

class InvitationController {
    async getStudentInvitations({ user: { userId } }) {
        const student = await studentService.findOneByUserIdWithLogin(userId);

        if (!student) {
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        return await invitationService.findAllByInviteEmail(student.login);
    }

    async getSchoolInvitations({ user: { userId } }) {
        const teacher = await teacherService.findOneByUserId(userId);
        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }

        const school = await schoolService.getOneByTeacherId(teacher.teacherId);
        if (!school) {
            throw new ValidationError(`No school found of teacher ${teacher}`);
        }

        return await invitationService.findAllBySchoolId(school.schoolId);
    }
}

module.exports = new InvitationController();
