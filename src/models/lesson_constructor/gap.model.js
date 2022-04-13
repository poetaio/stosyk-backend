module.exports = (sequelize, DataTypes) => sequelize.define('gap', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    gapPosition: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});
