module.exports = (sequelize, DataTypes) => sequelize.define('tasklist', {
    taskListId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});
