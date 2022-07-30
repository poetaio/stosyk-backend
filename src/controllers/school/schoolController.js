const teacherService = require("../../services/user/teacherService");
const {ValidationError} = require("../../utils");
const {schoolService} = require("../../services/school");
const jwt = require("jsonwebtoken");
const {studentService} = require("../../services");

class SchoolController {
    async addStudentsSeats({count}, {user: {userId}}) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }

        const school = await schoolService.getOneByTeacherId(teacher.teacherId);
        if (!school) {
            throw new ValidationError(`No school found of teacher ${teacher}`);
        }

        return await schoolService.addStudentsSeats(school.schoolId, count);
    }

    async getSeats({user: {userId}}) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }

        const school = await schoolService.getOneByTeacherId(teacher.teacherId);
        if (!school) {
            throw new ValidationError(`No school found of teacher ${teacher}`);
        }

        return await schoolService.getSeats(school.schoolId);
    }

    async inviteSchoolStudent({studentEmail}, {user: {userId}}) {
        const teacher = await teacherService.findOneByUserId(userId);
        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }

        const school = await schoolService.getOneByTeacherId(teacher.teacherId);
        if (!school) {
            throw new ValidationError(`No school found of teacher ${teacher}`);
        }

        const {schoolId, name: schoolName} = school;

        return await schoolService.inviteStudentWithSchoolName(schoolId, schoolName, studentEmail);
    }

    async cancelInviteSchoolStudent({studentEmail}, {user: {userId}}) {
        const teacher = await teacherService.findOneByUserId(userId);
        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }

        const school = await schoolService.getOneByTeacherId(teacher.teacherId);
        if (!school) {
            throw new ValidationError(`No school found of teacher ${teacher}`);
        }

        return await schoolService.cancelInviteSchoolStudent(school.schoolId, studentEmail);
    }

    async acceptSchoolStudentInvitation({inviteToken}, {user: {userId}}) {
        const student = await studentService.findOneByUserIdWithLogin(userId);

        if (!student) {
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        try {
            const {email: inviteEmail} = jwt.verify(inviteToken, process.env.JWT_SECRET);

            if (student.email !== inviteEmail) {
                return false;
            }

            // todo:   as no schoolId specified, invitations to all school for this email
            //         will be accepted
            return await schoolService.occupySeat(inviteEmail, student.studentId);
        } catch (e) {
            console.error(`Could not occupy seat: `, e);
            return false;
        }
    }

    async removeSchoolStudent({studentId}, {user: {userId}}) {
        const teacher = await teacherService.findOneByUserId(userId);
        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }

        const school = await schoolService.getOneByTeacherId(teacher.teacherId);
        if (!school) {
            throw new ValidationError(`No school found of teacher ${teacher}`);
        }

        return schoolService.removeStudent(school.schoolId, studentId);
    }

    async getFreeSeatsCount({user: {userId}}) {
        const teacher = await teacherService.findOneByUserId(userId);
        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }

        const school = await schoolService.getOneByTeacherId(teacher.teacherId);
        if (!school) {
            throw new ValidationError(`No school found of teacher ${teacher}`);
        }

        return schoolService.countFreeSeats(school.schoolId);
    }

    async getStudents({user: {userId}}) {
        const teacher = await teacherService.findOneByUserId(userId);

        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }

        const school = await schoolService.getOneByTeacherId(teacher.teacherId);
        if (!school) {
            throw new ValidationError(`No school found of teacher ${teacher}`);
        }

        return await schoolService.getStudents(school.schoolId);
    }
}

module.exports = new SchoolController();
