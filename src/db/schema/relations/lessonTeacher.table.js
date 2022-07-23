const LessonTable = require("../lesson/lesson.table");
const TeacherTable = require("../user/teacher.table");

module.exports = (DataTypes) => ['lessonTeachers', {
    lessonTeacherId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
    teacherId: {
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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
