const lessonTypeEnum = require("../../utils/enums/LessonType.enum");


module.exports = (sequelize, DataTypes) => sequelize.define('lesson', {
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
        type: DataTypes.ENUM(...Object.values(lessonTypeEnum)),
        defaultValue: lessonTypeEnum.PENDING
    }
});
