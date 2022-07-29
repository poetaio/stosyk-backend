const SchoolTable = require("../lesson/school.table");
const TeacherTable = require("../user/teacher.table");
const {SchoolTeacherAccessEnum} = require("../../../utils");

module.exports = (DataTypes) => ["schoolTeachers", {
    schoolTeacherId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    schoolId: {
        type: DataTypes.UUID,
        references: {
            model: SchoolTable(DataTypes)[0],
            key: 'schoolId',
        }
    },
    teacherId: {
        type: DataTypes.UUID,
        references: {
            model: TeacherTable(DataTypes)[0],
            key: 'teacherId',
        }
    },
    accessRight: {
        type: DataTypes.ENUM(...Object.values(SchoolTeacherAccessEnum)),
        allowNull: false,
        defaultValue: SchoolTeacherAccessEnum.RUN_LESSONS,
    },
}];
