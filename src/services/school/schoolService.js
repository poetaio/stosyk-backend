const {
    School,
    allSchoolsByTeacherIdInclude,
    SchoolTeacher,
    SchoolStudentSeat,
    Student,
    allStudentsBySchoolIdInclude, allSeatsByStudentEmailInclude, studentAccountInclude
} = require("../../db/models");
const {SchoolTeacherAccessEnum, SchoolStudentSeatStatusEnum, ValidationError, normalizeDate, emailTransport, logger} = require("../../utils");
const {Op, literal, fn} = require('sequelize');
const {tokenService} = require("../user");
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
                status: SchoolStudentSeatStatusEnum.FREE
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
                include: [['schoolStudentSeatId', 'seatId']],
            },
            where: {schoolId},
        });
    }

    async getFreeSeat(schoolId) {
        return await SchoolStudentSeat.findOne({
            where: {
                schoolId,
                status: SchoolStudentSeatStatusEnum.FREE,
            },
        });
    }

    /**
     * Remove all invites which are expired (joinedAt < now() - 24h)
     */
    async updateOutdatedInvitedSeats(schoolId) {
        await SchoolStudentSeat.update({
            inviteEmail: "",
            joinedAt: null,
            status: SchoolStudentSeatStatusEnum.FREE,
        }, {
            where: {
                schoolId,
                status: SchoolStudentSeatStatusEnum.INVITED,
                joinedAt: {[Op.lt]: (normalizeDate(new Date(new Date().getTime() - 60 * 60 * 24 * 1000)))}
            }
        });
    }

    async isStudentSeated(schoolId, studentEmail) {
        return !!await SchoolStudentSeat.count({
            include: allSeatsByStudentEmailInclude(studentEmail),
            where: {
                schoolId,
                status: [SchoolStudentSeatStatusEnum.OCCUPIED],
            }
        });
    }

    async isStudentInvited(schoolId, studentEmail) {
        return !!await SchoolStudentSeat.count({
            where: {
                schoolId,
                inviteEmail: studentEmail,
                status: [SchoolStudentSeatStatusEnum.INVITED],
            }
        });
    }

    async sendInvite(schoolId, schoolName, inviteEmail) {
        if (
            await this.isStudentSeated(schoolId, inviteEmail) ||
            await this.isStudentInvited(schoolId, inviteEmail)
        ) {
            return;
        }

        const seat = await this.getFreeSeat(schoolId);
        await SchoolStudentSeat.update({
            status: SchoolStudentSeatStatusEnum.INVITED,
            inviteEmail,
            joinedAt: normalizeDate(new Date()),
        }, {
            where: {
                schoolStudentSeatId: seat.schoolStudentSeatId,
            },
        })
        // generate jwt with 24h invite and seat id in it
        const inviteToken = await tokenService.createSchoolStudentInviteToken(inviteEmail);

        // console.log it instead of sending
        if ("production" !== process.env.NODE_ENV) {
            console.log(`INFO: Generated invite to school ${schoolId} jwt for student with email ${inviteEmail}: ${inviteToken}`);
        }

        emailService.sendEmail(emailFactoryService.createInvitationEmail(schoolName, inviteEmail, inviteToken));
    }

    async inviteStudentWithSchoolName(schoolId, schoolName, inviteEmail) {
        await this.updateOutdatedInvitedSeats(schoolId);

        if (!await this.countFreeSeats(schoolId)) {
            throw new ValidationError(`No free seats for school ${schoolId}`);
        }

        this.sendInvite(schoolId, schoolName, inviteEmail);

        return true;
    }

    async inviteStudent(schoolId, studentId) {
        const { name: schoolName } = this.getOneById(schoolId);
        return await this.inviteStudentWithSchoolName(schoolId, schoolName, studentId);
    }

    async cancelInviteSchoolStudent(schoolId, inviteEmail) {
        SchoolStudentSeat.update({
            joinedAt: null,
            inviteEmail: "",
            status: SchoolStudentSeatStatusEnum.FREE,
        }, {
            where: {
                schoolId,
                inviteEmail,
            }
        });

        return true;
    }

    async occupySeat(inviteEmail, studentId) {
        const upd = await SchoolStudentSeat.update({
            status: SchoolStudentSeatStatusEnum.OCCUPIED,
            joinedAt: normalizeDate(new Date()),
            inviteEmail: null,
            studentId,
        }, {
            where: {
                inviteEmail,
                status: SchoolStudentSeatStatusEnum.INVITED,
            },
        });

        return !!upd[0];
    }

    async removeStudent(schoolId, studentId) {
        SchoolStudentSeat.update({
            studentId: null,
            joinedAt: null,
            status: SchoolStudentSeatStatusEnum.FREE
        }, {
            where: {schoolId, studentId}
        });

        return true;
    }

    async getStudents(schoolId) {
        return await Student.findAll({
            include: [
                allStudentsBySchoolIdInclude(schoolId),
                studentAccountInclude,
            ],
            attributes: {
                include: [
                    [Sequelize.col('seats.status'), 'status'],
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
}

module.exports = new SchoolService();
