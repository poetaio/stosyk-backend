const SchoolTable = require("../school/school.table");
const StudentTable = require("../user/student.table");
const {SchoolStudentSeatStatusEnum} = require("../../../utils");

module.exports = (DataTypes) => ["schoolStudentSeats", {
    schoolStudentSeatId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    schoolId: {
        type: DataTypes.UUID,
        references: {
            model: SchoolTable(DataTypes)[0],
            key: 'schoolId',
        },
    },
    studentId: {
        type: DataTypes.UUID,
        references: {
            model: StudentTable(DataTypes)[0],
            key: 'studentId',
        },
    },
    status: {
        type: DataTypes.ENUM(...Object.values(SchoolStudentSeatStatusEnum)),
        allowNull: false,
        defaultValue: SchoolStudentSeatStatusEnum.FREE,
    },
    inviteEmail: {
        type: DataTypes.STRING,
    },
    joinedAt: {
        type: DataTypes.DATE,
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
}];
