module.exports = (sequelize, DataTypes) => sequelize.define('task', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    // name: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // },
    // description: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // },
    // type: {
    //     type: require('../utils/TaskType')(sequelize, DataTypes),
    //     allowNull: false
    // }
});
