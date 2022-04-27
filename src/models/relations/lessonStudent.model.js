module.exports = (sequelize, DataTypes) => sequelize.define('lessonStudent', {
    lessonStudentId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});
