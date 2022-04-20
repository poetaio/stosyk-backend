module.exports = (sequelize, DataTypes) => sequelize.define('active_sentence', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
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
