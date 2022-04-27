module.exports = (sequelize, DataTypes) => sequelize.define('gapOption', {
    gapOptionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});
