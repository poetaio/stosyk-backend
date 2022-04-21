module.exports = (sequelize, DataTypes) => sequelize.define('lessonTeacher', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});
