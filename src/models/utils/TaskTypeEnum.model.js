const taskTypeEnum = require('./TaskTypeEnum');

module.exports = (sequelize, DataTypes) => DataTypes.ENUM(
    ...Object.values(taskTypeEnum)
);
