module.exports = (sequelize, DataTypes) => sequelize.define('studentOption', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});
