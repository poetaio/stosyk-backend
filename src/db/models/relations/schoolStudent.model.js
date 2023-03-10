const SchoolTable = require("../../schema/school/school.table");
const StudentTable = require("../../schema/user/student.table");

module.exports = (sequelize, DataTypes) => sequelize.define('schoolStudent', {
    schoolStudentId: {
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
    joinedAt: {
        type: DataTypes.DATE,
    },
    droppedOutAt: {
        type: DataTypes.DATE,
    },
});
