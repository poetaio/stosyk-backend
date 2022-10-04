module.exports = (sequelize, DataTypes) => sequelize.define('lessonMarkups', {
    lessonMarkupId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Урок"
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: false,
        defaultValue: "Урок учителя для учнів"
    },
});
