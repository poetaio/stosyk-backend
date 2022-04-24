module.exports = (sequelize, DataTypes) => sequelize.define('taskSentence', {
    taskSentenceId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});
