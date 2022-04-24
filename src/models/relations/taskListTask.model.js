module.exports = (sequelize, DataTypes) => sequelize.define('taskListTask', {
    taskListTaskId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});
