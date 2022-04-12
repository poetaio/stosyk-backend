const studentAnswerSheetStatusEnum = require('./StudentAnswerSheetStatusEnum');


module.exports = (sequelize, DataTypes) => DataTypes.ENUM(
    ...Object.values(studentAnswerSheetStatusEnum)
);
