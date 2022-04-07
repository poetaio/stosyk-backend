module.exports = (sequelize, DataTypes) => ({
    ActiveLesson: require('./activeLesson.model')(sequelize, DataTypes),
    ActiveTask: require('./activeTask.model')(sequelize, DataTypes),
    ActiveSentence: require('./activeSentence.model')(sequelize, DataTypes),
    ActiveOption: require('./activeOption.model')(sequelize, DataTypes),
    StudentAnswerSheet: require('./studentAnswerSheet.model')(sequelize, DataTypes),
    StudentAnswer: require('./studentAnswer.model')(sequelize, DataTypes)
});
