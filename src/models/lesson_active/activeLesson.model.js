module.exports = (sequelize, DataTypes) => sequelize.define('active_lesson', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    // name: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // }
});
