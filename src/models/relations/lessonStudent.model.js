module.exports = (sequelize, DataTypes) => sequelize.define('lessonStudent', {
    lessonId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});
