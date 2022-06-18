const LessonTable = require("../lesson/lesson.table");
const StudentTable = require("../user/student.table");

module.exports = (DataTypes) => ['lessonStudents', {
    lessonStudentId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    lessonId: {
        type: DataTypes.UUID,
        references: {
            model: LessonTable(DataTypes)[0],
            key: 'lessonId',
        }
    },
    studentId: {
        type: DataTypes.UUID,
        references: {
            model: StudentTable(DataTypes)[0],
            key: 'studentId',
        }
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
}];
