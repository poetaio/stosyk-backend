module.exports = (sequelize, DataTypes) => sequelize.define('activeGap', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    gapPosition: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    answerShown: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});
