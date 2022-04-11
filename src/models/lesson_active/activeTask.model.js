module.exports = (sequelize, DataTypes) => sequelize.define('active_task', {
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
    //     type: require('../StudentAnswerSheetStatusEnum.model.js/TaskType')(sequelize, DataTypes),
    //     allowNull: false
    // }
});
