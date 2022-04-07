const sequelize = require('../services/dbService');
const { DataTypes } = require('sequelize');

const User = require('./user.model')(sequelize, DataTypes);

const {
    Lesson,
    Task,
    Sentence,
    Option
} = require('./lesson_constructor/index')(sequelize, DataTypes);

const {
    ActiveLesson,
    ActiveTask,
    ActiveSentence,
    ActiveOption,
    StudentAnswerSheet,
    StudentAnswer
} = require('./lesson_active/index')(sequelize, DataTypes);


// lesson constructor relations
User.hasMany(Lesson);
Lesson.belongsTo(User, {
    foreignKey: "authorId",
    as: "author"
});

Lesson.hasMany(Task);
Task.belongsTo(Lesson);

Task.hasMany(Sentence);
Sentence.belongsTo(Task);

Sentence.hasMany(Option);
Option.belongsTo(Sentence);

Sentence.hasOne(Option, {
    foreignKey: 'rightOptionId'
});
Option.belongsTo(Sentence, {
    foreignKey: 'rightOptionId'
});

// active lesson relations
Lesson.hasMany(ActiveLesson, {
    foreignKey: "lessonMarkupId",
});
ActiveLesson.belongsTo(Lesson, {
    foreignKey: "lessonMarkupId",
});

User.hasMany(ActiveLesson, {
    foreignKey: "teacherId"
});
ActiveLesson.belongsTo(User, {
    foreignKey: "teacherId"
});

ActiveLesson.hasMany(ActiveTask);
ActiveTask.belongsTo(ActiveLesson);

ActiveTask.hasMany(ActiveSentence);
ActiveSentence.belongsTo(ActiveTask);

ActiveOption.hasOne(ActiveSentence, {
    foreignKey: "rightOptionId"
});
ActiveSentence.belongsTo(ActiveOption, {
    foreignKey: "rightOptionId"
});

// student relations
User.belongsToMany(ActiveLesson, {
    through: StudentAnswerSheet,
    as: "activeLessons",
    foreignKey: "studentId",
});
ActiveLesson.belongsToMany(User, {
    through: StudentAnswerSheet,
    as: "students",
    foreignKey: "activeLessonId",
});

StudentAnswerSheet.hasMany(StudentAnswer);
StudentAnswer.belongsTo(StudentAnswerSheet);

StudentAnswer.hasOne(ActiveSentence);
ActiveSentence.belongsTo(StudentAnswer);

ActiveOption.hasMany(StudentAnswer, {
    foreignKey: "chosenOptionId"
});
StudentAnswer.belongsTo(ActiveOption, {
    foreignKey: "chosenOptionId"
});

module.exports = {
    User,
    Lesson,
    Task,
    Sentence,
    Option,
    ActiveLesson,
    ActiveTask,
    ActiveSentence,
    ActiveOption,
    StudentAnswerSheet,
    StudentAnswer
}
