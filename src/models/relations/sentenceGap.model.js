module.exports = (sequelize, DataTypes) => sequelize.define('sentenceGap', {
    sentenceGapId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});
