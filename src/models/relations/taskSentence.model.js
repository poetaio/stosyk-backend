module.exports = (sequelize, DataTypes) => sequelize.define('taskSentence', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});
