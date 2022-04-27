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
    },
    {
        // sequelize.models.Sentence
        // hooks: {
        //     beforeDestroy(instance, options) {
        //         console.log(instance);
        //     }
        // }
    });
