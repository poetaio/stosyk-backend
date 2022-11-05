const SchoolTable = require("../school/school.table");
const {SchoolInvitationStatusEnum} = require("../../../utils");

module.exports = (DataTypes) => ['schoolInvitations', {
    invitationId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    inviteEmail: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    schoolId: {
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: SchoolTable(DataTypes)[0],
            key: 'schoolId',
        },
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
}];
