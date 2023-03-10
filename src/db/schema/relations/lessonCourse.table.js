const LessonTable = require("../lesson/lesson.table");
const CourseTable = require('../lesson/course.table')
module.exports = (DataTypes) => ['lessonCourses', {
    lessonCourseId: {
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
    courseId: {
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: CourseTable(DataTypes)[0],
            key: 'courseId',
        }
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
}];
