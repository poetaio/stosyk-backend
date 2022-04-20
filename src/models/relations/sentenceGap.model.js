module.exports = (sequelize, DataTypes) => sequelize.define('sentenceGap', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});
