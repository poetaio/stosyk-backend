module.exports = (sequelize, DataTypes) => sequelize.define('student', {
    studentId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});
