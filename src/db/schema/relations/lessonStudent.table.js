const LessonTable = require("../lesson/lesson.table");
const StudentTable = require("../user/student.table");

module.exports = (DataTypes) => ['lessonStudents', {
    lessonStudentId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        primaryKey: true
    },
    lessonId: {
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
