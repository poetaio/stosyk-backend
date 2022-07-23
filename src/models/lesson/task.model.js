const { TaskTypeEnum } = require("../../utils");
module.exports = (sequelize, DataTypes) => sequelize.define('task',
    {
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
        description: {
            type: DataTypes.STRING(500),
            allowNull: false,
            defaultValue: ""
        },
    },
    {
        // sequelize.models.Sentence
        // hooks: {
        //     beforeDestroy(instance, options) {
        //         console.log(instance);
        //     }
        // }
    });
