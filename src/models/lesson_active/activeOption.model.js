module.exports = (sequelize, DataTypes) => sequelize.define('active_option', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    }
});
