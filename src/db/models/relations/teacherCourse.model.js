module.exports = (sequelize, DataTypes) => sequelize.define('teacherCourse', {
    teacherCourseId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});