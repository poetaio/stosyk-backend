const teacherService = require("../../services/user/teacherService");
const {ValidationError, NotFoundError} = require("../../utils");
const {schoolService, invitationService} = require("../../services/school");
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

        return await schoolService.addStudentsSeats(school, count);
    }

    async inviteSchoolStudent({studentEmail}, {user: {userId}}) {
        const teacher = await teacherService.findOneByUserIdWithUser(userId);
        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }

        const school = await schoolService.getOneByTeacherId(teacher.teacherId);
        if (!school) {
            throw new ValidationError(`No school found of teacher ${teacher}`);
        }

        const {schoolId, name: schoolName} = school;
        let schoolOrTeacherName;
        if (schoolName) {
            schoolOrTeacherName = schoolName;
        } else {
            schoolOrTeacherName = teacher.user.name;
        }

        if (await schoolService.isStudentInSchool(schoolId, studentEmail)) {
            throw new ValidationError(`Student ${studentEmail} already in school`);
        }

        if (await invitationService.isStudentAlreadyInvited(schoolId, studentEmail)) {
            throw new ValidationError(`Student ${studentEmail} already invited`);
        }

        await invitationService.removeOutdatedInvitesBySchoolId(schoolId);

        const freeSeatsCount = await this.countFreeSeats(school);
        if (!freeSeatsCount) {
            throw new ValidationError(`No free seats for school ${schoolId}`, 10102);
        }

        const {invitationId} = await invitationService.createInvitation(schoolId, studentEmail);
        await schoolService.sendInvite(studentEmail, schoolOrTeacherName, invitationId);

        return invitationId;
    }

    async cancelInviteSchoolStudent({invitationId}, {user: {userId}}) {
        const teacher = await teacherService.findOneByUserId(userId);
        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }

        const school = await schoolService.getOneByTeacherId(teacher.teacherId);
        if (!school) {
            throw new ValidationError(`No school found of teacher ${teacher}`);
        }

        const invitation = await invitationService.findOneById(invitationId);
        if (!invitation || school.schoolId !== invitation.schoolId) {
            throw new ValidationError(`No invitation found of school`);
        }

        return await invitationService.cancelInviteSchoolStudent(invitationId);
    }

    async acceptSchoolStudentInvitation({invitationId}, {user: {userId}}) {
        const student = await studentService.findOneByUserIdWithLogin(userId);

        if (!student) {
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        const invitation = await invitationService.findOneByIdPending(invitationId);

        // checking that the right person accepts the right invitation with the right invite token
        if (!invitation || invitation.inviteEmail !== student.login) {
            throw new NotFoundError(`No PENDING invitation ${invitationId} found to accept`);
        }

        const {schoolId} = invitation;
        const {studentId} = student;

        await invitationService.acceptInvitation(invitationId);
        await schoolService.addStudent(schoolId, studentId);
        return true;
    }

    async declineSchoolStudentInvitation({ invitationId }, { user: { userId } }) {
        const student = await studentService.findOneByUserIdWithLogin(userId);

        if (!student) {
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        const invitation = invitationService.findOneById(invitationId);
        const {inviteEmail: invitationEmail} = invitation.inviteEmail;

        // checking that the right person accepts the right invitation with the right invite token
        if (!invitation || invitationEmail !== student.login) {
            return false;
        }

        return await invitationService.declineInvitationById(invitationId);
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

        return await schoolService.removeStudent(school.schoolId, studentId);
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

        return await this.countFreeSeats(school);
    }

    // todo: use Redis as cache instead of querying each time
    async countFreeSeats(school) {
        const {totalSeatsCount} = school;
        const studentsCount = await schoolService.countStudents(school.schoolId);
        const invitesCount = await invitationService.countInvitesBySchoolId(school.schoolId);

        return totalSeatsCount - studentsCount - invitesCount;
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

    async getSchool({user: {userId}}) {
        const teacher = await teacherService.findOneByUserId(userId);
        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }

        const school = await schoolService.getOneByTeacherId(teacher.teacherId);
        if (!school) {
            throw new ValidationError(`No school found of teacher ${teacher}`);
        }

        return school;
    }

    async editSchool({newName}, {user: {userId}}) {
        const teacher = await teacherService.findOneByUserId(userId);
        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }

        const school = await schoolService.getOneByTeacherId(teacher.teacherId);
        if (!school) {
            throw new ValidationError(`No school found of teacher ${teacher}`);
        }

        if (newName) {
            await schoolService.renameSchool(school.schoolId, newName);
        }

        return true;
    }

    async getStudentSchools({schoolId}, {user: { userId } }) {
        const student = await studentService.findOneByUserIdWithLogin(userId);

        if (!student) {
            throw new ValidationError(`User with id ${userId} and role STUDENT not found`);
        }

        let schools;
        if (schoolId) {
            schools = [await schoolService.getOneByIdAndStudentId(schoolId, student.studentId)];
        } else {
            schools = await schoolService.getAllByStudentId(student.studentId);
        }

        return await this.setSchoolNamesIfItIsNull(schools);
    }

    async setSchoolNameIfItIsNull(school) {
        if (!school.name) {
            const teacher = await teacherService.findOneBySchoolIdWithUser(school.schoolId);
            school.name = teacher.user.name;
        }
        return school;
    }

    async setSchoolNamesIfItIsNull(schools) {
        return await Promise.all(
            schools.map(school =>
                this.setSchoolNameIfItIsNull(school)
            )
        );
    }

    async getOneByIdNameNonNull({schoolId}) {
        const school = await schoolService.getOneById(schoolId);
        return await this.setSchoolNameIfItIsNull(school);
    }
}

module.exports = new SchoolController();
