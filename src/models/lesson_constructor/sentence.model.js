module.exports = (sequelize, DataTypes) => sequelize.define('sentence', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    text: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gapPosition: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});
