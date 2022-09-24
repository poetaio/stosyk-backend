const {LessonStatusEnum} = require("../../../utils");

module.exports = (DataTypes) => ['lessonMarkups', {
    lessonMarkupId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Урок",
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: "Урок учителя для учнів",
    },
    teacherId: {
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: 'teachers',
            key: 'teacherId',
        }
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
    schoolId: {
        type: DataTypes.UUID,
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        references: {
            model: 'schools',
            key: 'schoolId',
        },
    },
}];
