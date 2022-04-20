module.exports = (sequelize, DataTypes) => sequelize.define('gapOption', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});
