module.exports = (sequelize, DataTypes) => sequelize.define('taskList', {
    taskListId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});
