module.exports = (sequelize, DataTypes) => sequelize.define('homeworks', {
    homeworkId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});
