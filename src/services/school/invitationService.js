const {SchoolInvitation, invitationStatusIndex} = require("../../db/entities");
const {SchoolInvitationStatusEnum, normalizeDate} = require("../../utils");
const {Op} = require("sequelize");

const INVITATION_EXPIRE_TIME_MILLIS = 60 * 60 * 24 * 1000;

class InvitationService {
    async findOneById(invitationId) {
        return await SchoolInvitation.findOne({
            where: { invitationId },
        })
    }

    async findOneByIdPending(invitationId) {
        return await SchoolInvitation.findOne({
            where: {
                invitationId,
                status: SchoolInvitationStatusEnum.PENDING,
            },
        })
    }

    async findAllByInviteEmail(inviteEmail) {
        return await SchoolInvitation.findAll({
            where: { inviteEmail },
            attributes: {
                include: [invitationStatusIndex],
            },
            order: [
                ['statusIndex', 'ASC'],
                ['createdAt', 'DESC'],
            ],
        });
    }

    async findAllBySchoolId(schoolId) {
        return await SchoolInvitation.findAll({
            where: { schoolId },
            attributes: {
                include: [invitationStatusIndex],
            },
            order: [
                ['statusIndex', 'ASC'],
                ['createdAt', 'DESC'],
            ],
        });
    }

    async acceptInvitation(invitationId) {
        SchoolInvitation.update({
            status: SchoolInvitationStatusEnum.ACCEPTED,
        }, {
            where: {
                invitationId,
            }
        });

        return true;
    }

    async cancelInviteSchoolStudent(invitationId) {
        SchoolInvitation.update({
            status: SchoolInvitationStatusEnum.WITHDRAWN,
        }, {
            where: {
                invitationId,
            }
        });

        return true;
    }

    async countInvitesBySchoolId(schoolId) {
        return await SchoolInvitation.count({
            where: {
                schoolId,
                status: SchoolInvitationStatusEnum.PENDING,
            },
        });
    }

    async removeOutdatedInvitesBySchoolId(schoolId) {
        await SchoolInvitation.update({
            status: SchoolInvitationStatusEnum.EXPIRED,
        }, {
            where: {
                schoolId,
                status: SchoolInvitationStatusEnum.PENDING,
                createdAt: {[Op.lt]: (normalizeDate(new Date(new Date().getTime() - INVITATION_EXPIRE_TIME_MILLIS)))}
            }
        });
    }

    async removeOutdatedInvitesByInvitationId(invitationId) {
        await SchoolInvitation.update({
            status: SchoolInvitationStatusEnum.EXPIRED,
        }, {
            where: {
                invitationId,
                status: SchoolInvitationStatusEnum.PENDING,
                joinedAt: {[Op.lt]: (normalizeDate(new Date(new Date().getTime() - INVITATION_EXPIRE_TIME_MILLIS)))}
            }
        });
    }

    async removeOutdatedInvitesByEmail(inviteEmail) {
        await SchoolInvitation.update({
            status: SchoolInvitationStatusEnum.EXPIRED,
        }, {
            where: {
                inviteEmail,
                status: SchoolInvitationStatusEnum.PENDING,
                joinedAt: {[Op.lt]: (normalizeDate(new Date(new Date().getTime() - INVITATION_EXPIRE_TIME_MILLIS)))}
            }
        });
    }

    async existsAcceptedInviteByEmailAndSchoolId(studentEmail, schoolId) {
        return !!await SchoolInvitation.count({
            where: {
                inviteEmail: studentEmail,
                schoolId,
            }
        })
    }

    async createInvitation(schoolId, inviteEmail) {
        return await SchoolInvitation.create({
            status: SchoolInvitationStatusEnum.PENDING,
            inviteEmail,
            schoolId,
        });
    }

    async declineInvitationById(invitationId) {
        const upd = await SchoolInvitation.update({
            status: SchoolInvitationStatusEnum.DECLINED,
        }, {
            where: {
                invitationId,
            }
        });

        return !!upd[0];
    }

    async isStudentAlreadyInvited(schoolId, inviteEmail) {
        return !!await SchoolInvitation.count({
            where: {
                schoolId,
                inviteEmail,
                status: SchoolInvitationStatusEnum.PENDING,
            }
        });
    }
}

module.exports = new InvitationService();
