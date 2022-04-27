module.exports = (sequelize, DataTypes) => sequelize.define('sentence', {
    sentenceId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    index: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
