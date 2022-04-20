const activeLessonStatusEnum = require('./ActiveLessonStatusEnum');

module.exports = (sequelize, DataTypes) => DataTypes.ENUM(
    ...Object.values(activeLessonStatusEnum)
);
