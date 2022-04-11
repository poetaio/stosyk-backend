const sequelize = require('../services/dbService');
const { DataTypes } = require('sequelize');

const Teacher = require('./teacher.model')(sequelize, DataTypes);
const Student = require('./student.model')(sequelize, DataTypes);
const Account = require('./account.model')(sequelize, DataTypes);

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


// teacher account
Account.hasOne(Teacher, {
    foreignKey: 'accountId',
    as: 'accountTeacher'
});
Teacher.belongsTo(Account, {
    foreignKey: 'accountId',
    as: 'account'
});

// student account
Account.hasOne(Student, {
    foreignKey: 'accountId',
    as: 'accountStudent'
});
Student.belongsTo(Account, {
    foreignKey: 'accountId',
    as: 'account',
})

// teacher's lesson markups
Teacher.hasMany(Lesson, {
    foreignKey: "authorId",
    as: 'lessons'
});
Lesson.belongsTo(Teacher, {
    foreignKey: "authorId",
    as: "author"
});

// lesson tasks
Lesson.hasMany(Task, {
    as: 'tasks'
});
Task.belongsTo(Lesson, {
    as: 'lesson'
});

Task.hasMany(Sentence, {
    as: 'sentences'
});
Sentence.belongsTo(Task, {
    as: 'task'
});

// sentence available options
Sentence.hasMany(Option, {
    as: 'options'
});
Option.belongsTo(Sentence);

// sentence right option
Option.hasOne(Sentence, {
    foreignKey: 'rightOptionId',
    as: 'sentenceRightAnswerTo',
    constraints: false,
});
Sentence.belongsTo(Option, {
    foreignKey: 'rightOptionId',
    as: 'rightOption',
    constraints: false,
});

// active lesson markup
Lesson.hasMany(ActiveLesson, {
    foreignKey: "lessonMarkupId"
});
ActiveLesson.belongsTo(Lesson, {
    foreignKey: "lessonMarkupId",
    as: 'lessonMarkup'
});

// teacher's active lessons
Teacher.hasMany(ActiveLesson, {
    foreignKey: "teacherId",
    as: 'teacherActiveLessons'
});
ActiveLesson.belongsTo(Teacher, {
    foreignKey: "teacherId",
    as: 'teacher'
});

// tasks of a lesson
ActiveLesson.hasMany(ActiveTask, {
    as: 'activeTasks'
});
ActiveTask.belongsTo(ActiveLesson, {
    as: 'activeLesson'
});

ActiveTask.hasMany(ActiveSentence, {
    as: 'activeSentences'
});
ActiveSentence.belongsTo(ActiveTask, {
    as: 'activeTask'
});

// active sentence available options
ActiveSentence.hasMany(ActiveOption, {
    foreignKey: 'activeSentenceId',
    as: 'options'
});
ActiveOption.belongsTo(ActiveSentence, {
    foreignKey: 'activeSentenceId',
    as: 'sentenceAvailableIn'
});

// right option of an active sentence
ActiveOption.hasOne(ActiveSentence, {
    foreignKey: "rightOptionId",
    as: 'sentenceRightAnswerTo',
    constraints: false,
});
ActiveSentence.belongsTo(ActiveOption, {
    foreignKey: "rightOptionId",
    as: 'rightOption',
    constraints: false
});

// student active lessons
Student.belongsToMany(ActiveLesson, {
    through: StudentAnswerSheet,
    foreignKey: "studentId",
    as: "studentActiveLessons"
});
ActiveLesson.belongsToMany(Student, {
    through: StudentAnswerSheet,
    foreignKey: "activeLessonId",
    as: "students",
});

// student answers
StudentAnswerSheet.hasMany(StudentAnswer, {
    foreignKey: 'answerSheetId',
    as: 'answers'
});
StudentAnswer.belongsTo(StudentAnswerSheet, {
    foreignKey: 'answerSheetId',
    as: 'answerStudent'
});

// answers given by students in active sentence
ActiveSentence.hasMany(StudentAnswer, {
    foreignKey: 'activeSentenceId',
    as: 'studentsAnswers'
});
StudentAnswer.belongsTo(ActiveSentence, {
    foreignKey: 'activeSentenceId',
    as: 'answerSentence'
});

// chosen option by student
ActiveOption.hasMany(StudentAnswer, {
    foreignKey: "chosenOptionId",
    as: 'studentsOptions'
});
StudentAnswer.belongsTo(ActiveOption, {
    foreignKey: "chosenOptionId"
});

module.exports = {
    Teacher,
    Student,
    Account,
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
