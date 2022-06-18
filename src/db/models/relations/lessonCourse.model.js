module.exports = (sequelize, DataTypes) => sequelize.define('lessonCourse', {
    lessonCourseId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});
