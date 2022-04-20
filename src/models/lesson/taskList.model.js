module.exports = (sequelize, DataTypes) => sequelize.define('taskList', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});
