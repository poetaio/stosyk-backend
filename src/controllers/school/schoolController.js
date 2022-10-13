const teacherService = require("../../services/user/teacherService");
const {ValidationError, logger, NotFoundError, InternalError} = require("../../utils");
const {schoolService, invitationService} = require("../../services/school");
const jwt = require("jsonwebtoken");
const {studentService, userService} = require("../../services");
const {GraphQLError} = require("graphql");

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

        if (await schoolService.isStudentInSchool(schoolId, studentEmail)) {
            throw new ValidationError(`Student ${studentEmail} already in school`);
        }

        if (await invitationService.isStudentAlreadyInvited(schoolId, studentEmail)) {
            throw new ValidationError(`Student ${studentEmail} already invited`);
        }

        await invitationService.removeOutdatedInvitesBySchoolId(schoolId);

        const freeSeatsCount = await schoolService.countFreeSeats(schoolId);
        const invitesCount = await invitationService.countInvitesBySchoolId(schoolId);

        if (invitesCount >= freeSeatsCount) {
            throw new ValidationError(`No free seats for school ${schoolId}`, 10102);
        }

        const {invitationId} = await invitationService.createInvitation(schoolId, studentEmail);
        await schoolService.sendInvite(schoolName, studentEmail, invitationId);
        return true;
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

        const seat = await schoolService.getFreeSeat(schoolId);
        if (!seat) {
            throw new InternalError(`Could not accept invite, as there are no free seats. That should not happen please contact support@stosyk.app`);
        }

        return await schoolService.occupySeat(seat.schoolStudentSeatId, student.studentId);
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

        return await schoolService.countFreeSeats(school.schoolId);
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

    async removeSchoolSeat({seatId}, {user: { userId }}) {
        const teacher = await teacherService.findOneByUserId(userId);
        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }

        const school = await schoolService.getOneByTeacherId(teacher.teacherId);
        if (!school) {
            throw new ValidationError(`No school found of teacher ${teacher}`);
        }

        if (!await schoolService.existsSchoolSeat(school.schoolId, seatId)) {
            throw new ValidationError(`No seat ${seatId} found of school`)
        }

        if (await schoolService.isSeatOccupiedBySeatId(seatId)) {
            throw new ValidationError(`Seat ${seatId} is occupied`);
        }

        return await schoolService.removeSeat(seatId);
    }

    async getSeatCount({user: {userId}}) {
        const teacher = await teacherService.findOneByUserId(userId);
        if (!teacher) {
            throw new ValidationError(`User with id ${userId} and role TEACHER not found`);
        }

        const school = await schoolService.getOneByTeacherId(teacher.teacherId);
        if (!school) {
            throw new ValidationError(`No school found of teacher ${teacher}`);
        }

        return await schoolService.countSeats(school.schoolId);
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
}

module.exports = new SchoolController();
