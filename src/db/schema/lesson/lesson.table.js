const { LessonStatusEnum } = require("../../../utils");


module.exports = (DataTypes) => ['lessons', {
    lessonId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Урок"
    },
    status: {
        type: DataTypes.ENUM(...Object.values(LessonStatusEnum)),
        defaultValue: LessonStatusEnum.PENDING
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
}];
