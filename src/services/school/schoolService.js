const {
    School,
    allSchoolsByTeacherIdInclude,
    SchoolTeacher,
    SchoolStudent,
    Student,
    allStudentsBySchoolIdInclude,
    studentAccountInclude,
    allSeatsByStudentEmailInclude,
    seatStatus,
    allSchoolsByStudentIdInclude,
    schoolStudentStatus,
    schoolStudentJoinedAt,
    schoolStudentDroppedOutAt,
} = require("../../db/models");
const {
    SchoolTeacherAccessEnum,
    normalizeDate,
    logger,
} = require("../../utils");
const {Op} = require('sequelize');
const Sequelize = require("sequelize");
const {emailService, emailFactoryService} = require("../email");

class SchoolService {
    async getOneByTeacherId(teacherId) {
        return await School.findOne({
            include: allSchoolsByTeacherIdInclude(teacherId),
            raw: true,
        });
    }

    async getOneById(schoolId) {
        return await School.findOne({
            where: {schoolId},
            raw: true,
        });
    }

    async createWithName(teacherId, name) {
        const school = await School.create({name});
        await SchoolTeacher.create({
            schoolId: school.schoolId,
            teacherId,
            accessRight: SchoolTeacherAccessEnum.ADMIN,
        })

        return school;
    }

    async create(teacherId) {
        return await this.createWithName(teacherId, null);
    }

    async addStudentSeat(schoolId) {
        return await SchoolStudent.create({
            schoolId,
        });
    }

    async addStudentsSeats({schoolId, totalSeatsCount}, count) {
        const upd = await School.update({
            totalSeatsCount: totalSeatsCount + count,
        }, {
            where: {schoolId},
        });

        return !!upd[0];
    }

    async sendInvite(inviteEmail, schoolOrTeacherName, invitationId) {
        emailService.sendEmail(emailFactoryService.createInvitationEmail(inviteEmail, schoolOrTeacherName, invitationId));
    }

    async addStudent(schoolId, studentId) {
        return await SchoolStudent.create({
            joinedAt: normalizeDate(new Date()),
            schoolId,
            studentId,
        });
    }

    async removeStudent(schoolId, studentId) {
        const upd = await SchoolStudent.update({
            droppedOutAt: normalizeDate(new Date()),
        }, {
            where: {schoolId, studentId},
        });

        return !!upd[0];
    }

    async getStudents(schoolId) {
        return await Student.findAll({
            include: [
                allStudentsBySchoolIdInclude(schoolId),
                studentAccountInclude,
            ],
            attributes: {
                include: [
                    [Sequelize.col('user.account.login'), 'email'],
                    [Sequelize.col('user.name'), 'name'],
                ],
            },
            raw: true,
        }).then(studentModels => studentModels.map(
            student => {
                // including schoolId cause it's needed for SchoolStudentType's lessons and courses
                student.schoolId = schoolId;
                return student;
            }
        ));
    }

    async isStudentInSchool(schoolId, studentEmail) {
        return !!await SchoolStudent.count({
            where: {schoolId},
            include: allSeatsByStudentEmailInclude(studentEmail),
        })
    }

    async renameSchool(schoolId, newName) {
        const upd = await School.update({
            name: newName
        }, {
            where: {schoolId}
        });

        return !!upd[0];
    }

    async getAllByStudentId(studentId) {
        return await School.findAll({
            include: allSchoolsByStudentIdInclude(studentId),
            attributes: {
                include: [schoolStudentStatus, schoolStudentJoinedAt, schoolStudentDroppedOutAt]
            },
            raw: true,
        });
    }

    async getOneByIdAndStudentId(schoolId, studentId) {
        return await School.findOne({
            where: {schoolId},
            include: allSchoolsByStudentIdInclude(studentId),
            attributes: {
                include: [schoolStudentStatus, schoolStudentJoinedAt, schoolStudentDroppedOutAt]
            },
            raw: true,
        });
    }

    async countStudents(schoolId) {
        return SchoolStudent.count({
            where: {schoolId},
            droppedOutAt: null,
        })
    }
}

module.exports = new SchoolService();
