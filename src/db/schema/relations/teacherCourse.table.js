const CourseTable = require("../lesson/course.table");
const TeacherTable = require("../user/teacher.table");
module.exports = (DataTypes) => ['teacherCourse', {
    teacherCourseId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    courseId: {
        type: DataTypes.UUID,
        references: {
            model: CourseTable(DataTypes)[0],
            key: 'courseId',
        }
    },
    teacherId: {
        type: DataTypes.UUID,
        references: {
            model: TeacherTable(DataTypes)[0],
            key: 'teacherId',
        }
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
}];