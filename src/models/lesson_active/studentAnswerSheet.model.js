const StudentAnswerSheetStatus = require('./utils/StudentAnswerSheetStatusEnum.model');

module.exports = (sequelize, DataTypes) => sequelize.define('student_answer_sheet', {
    status: {
        type: StudentAnswerSheetStatus(sequelize, DataTypes),
        allowNull: false,
        defaultValue: 'NOT_JOINED'
    }
});
