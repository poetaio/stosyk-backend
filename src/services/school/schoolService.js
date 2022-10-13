const {
    School,
    allSchoolsByTeacherIdInclude,
    SchoolTeacher,
    SchoolStudentSeat,
    Student,
    allStudentsBySchoolIdInclude,
    studentAccountInclude, allSeatsByStudentEmailInclude, seatStatus,
} = require("../../db/models");
const {
    SchoolTeacherAccessEnum,
    normalizeDate,
    SchoolInvitationStatusEnum,
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

    async countFreeSeats(schoolId) {
        return await SchoolStudentSeat.count({
            where: {
                schoolId,
                studentId: null,
            },
        });
    }

    async countSeats(schoolId) {
        return await SchoolStudentSeat.count({
            where: {
                schoolId,
            },
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
        return await this.createWithName(teacherId, "default name");
    }

    async addStudentSeat(schoolId) {
        return await SchoolStudentSeat.create({
            schoolId,
        });
    }

    async addStudentsSeats(schoolId, count) {
        for (let i = 0; i < count; ++i) {
            this.addStudentSeat(schoolId)
                .catch(e => logger.error(e));
        }

        return true;
    }

    async getSeats(schoolId) {
        return await SchoolStudentSeat.findAll({
            raw: true,
            attributes: {
                include: [
                    ['schoolStudentSeatId', 'seatId'],
                    seatStatus,
                ],
            },
            where: {schoolId},
        });
    }

    async getFreeSeat(schoolId) {
        return await SchoolStudentSeat.findOne({
            where: {
                schoolId,
                studentId: null,
            },
        });
    }

    async sendInvite(schoolName, inviteEmail, inviteId) {
        emailService.sendEmail(emailFactoryService.createInvitationEmail(schoolName, inviteEmail, inviteId));
    }

    async occupySeat(schoolStudentSeatId, studentId) {
        const upd = await SchoolStudentSeat.update({
            joinedAt: normalizeDate(new Date()),
            studentId,
            status: SchoolInvitationStatusEnum.ACCEPTED
        }, {
            where: {
                schoolStudentSeatId,
            },
        });

        return !!upd[0];
    }

    async removeStudent(schoolId, studentId) {
        const upd = await SchoolStudentSeat.update({
            studentId: null,
            joinedAt: null,
        }, {
            where: {schoolId, studentId}
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

    async existsSchoolSeat(schoolId, schoolStudentSeatId) {
        return !!await SchoolStudentSeat.count({
            where: { schoolId, schoolStudentSeatId },
        })
    }

    async isSeatOccupiedBySeatId(schoolStudentSeatId) {
        return !!await SchoolStudentSeat.count({
            where: {
                schoolStudentSeatId,
                studentId: {
                    [Op.ne]: null
                }
            },
        });
    }

    async removeSeat(schoolStudentSeatId) {
        return !!await SchoolStudentSeat.destroy({
            where: {
                schoolStudentSeatId,
            },
        });
    }

    async isStudentInSchool(schoolId, studentEmail) {
        return !!await SchoolStudentSeat.count({
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
}

module.exports = new SchoolService();
