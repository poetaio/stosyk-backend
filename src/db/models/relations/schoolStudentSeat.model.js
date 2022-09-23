const SchoolTable = require("../../schema/school/school.table");
const StudentTable = require("../../schema/user/student.table");
const {SchoolStudentSeatStatusEnum} = require("../../../utils");

module.exports = (sequelize, DataTypes) => sequelize.define('schoolStudentSeat', {
    schoolStudentSeatId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    schoolId: {
        type: DataTypes.UUID,
        references: {
            model: SchoolTable(DataTypes)[0],
            key: 'schoolId',
        }
    },
    studentId: {
        type: DataTypes.UUID,
        references: {
            model: StudentTable(DataTypes)[0],
            key: 'studentId',
        }
    },
    status: {
        type: DataTypes.ENUM(...Object.values(SchoolStudentSeatStatusEnum)),
        allowNull: false,
        defaultValue: SchoolStudentSeatStatusEnum.FREE
    },
    joinedAt: {
        type: DataTypes.DATE,
    },
    inviteEmail: {
        type: DataTypes.STRING,
    },
});
