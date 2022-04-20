module.exports = (sequelize, DataTypes) => sequelize.define('teacher', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }
});
