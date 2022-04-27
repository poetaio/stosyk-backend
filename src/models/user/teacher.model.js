module.exports = (sequelize, DataTypes) => sequelize.define('teacher', {
    teacherId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }
});
