module.exports = (sequelize, DataTypes) => sequelize.define('student_answer', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});
