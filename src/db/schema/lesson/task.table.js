const { TaskTypeEnum } = require("../../../utils");

module.exports = (DataTypes) => ['tasks', {
    taskId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    answersShown: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    type: {
        type: DataTypes.ENUM(...Object.values(TaskTypeEnum)),
        allowNull: false,
        defaultValue: TaskTypeEnum.MULTIPLE_CHOICE
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
}];
