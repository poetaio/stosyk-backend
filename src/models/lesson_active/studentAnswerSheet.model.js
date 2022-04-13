const StudentAnswerSheetStatus = require('./utils/StudentAnswerSheetStatusEnum.model');

module.exports = (sequelize, DataTypes) => sequelize.define('student_answer_sheet', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    status: {
        type: StudentAnswerSheetStatus(sequelize, DataTypes),
        allowNull: false,
        defaultValue: 'JOINED'
    }
});
