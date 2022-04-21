module.exports = (sequelize, DataTypes) => sequelize.define('task', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    answerShown: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
});
