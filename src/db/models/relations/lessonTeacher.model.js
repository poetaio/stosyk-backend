module.exports = (sequelize, DataTypes) => sequelize.define('lessonTeacher', {
    lessonTeacherId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});
