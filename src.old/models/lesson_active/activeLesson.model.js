const ActiveLessonStatusEnum = require('./utils/ActiveLessonStatusEnum.model');


module.exports = (sequelize, DataTypes) => sequelize.define('active_lesson', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    status: {
        type: ActiveLessonStatusEnum(sequelize, DataTypes),
        defaultValue: 'NOT_STARTED',
        allowNull: false
    },
    // name: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // }
});
