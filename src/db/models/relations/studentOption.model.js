module.exports = (sequelize, DataTypes) => sequelize.define('studentOption', {
    studentOptionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
});
