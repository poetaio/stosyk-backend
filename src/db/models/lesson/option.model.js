module.exports = (sequelize, DataTypes) => sequelize.define('option', {
    optionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isCorrect: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
});
