module.exports = (sequelize, DataTypes) => ({
    Lesson: require('./lesson.model')(sequelize, DataTypes),
    Task: require('./task.model')(sequelize, DataTypes),
    Sentence: require('./sentence.model')(sequelize, DataTypes),
    Option: require('./option.model')(sequelize, DataTypes)
});
