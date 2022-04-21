module.exports = (sequelize, DataTypes) => sequelize.define('taskListTask', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});
