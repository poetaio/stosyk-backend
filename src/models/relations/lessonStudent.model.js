module.exports = (sequelize, DataTypes) => sequelize.define('lessonStudent', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});
