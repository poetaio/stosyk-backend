const {SchoolInvitationStatusEnum} = require("../../../utils");

module.exports = (sequelize, DataTypes) => sequelize.define('schoolInvitations', {
    invitationId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    inviteEmail: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(...Object.values(SchoolInvitationStatusEnum)),
        allowNull: false,
        defaultValue: SchoolInvitationStatusEnum.PENDING,
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
});
