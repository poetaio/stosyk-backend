const sequelize = require('../services/dbService');
const { DataTypes } = require('sequelize');

const Teacher = require('./teacher.model')(sequelize, DataTypes);
const Student = require('./student.model')(sequelize, DataTypes);
const Account = require('./account.model')(sequelize, DataTypes);

const {
    Lesson,
    Task,
    Gap,
    Option
} = require('./lesson_constructor/index')(sequelize, DataTypes);

const {
    ActiveLesson,
    ActiveTask,
    ActiveGap,
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

Task.hasMany(Gap, {
    as: 'gaps'
});
Gap.belongsTo(Task, {
    as: 'task'
});

// sentence available options
Gap.hasMany(Option, {
    as: 'options'
});
Option.belongsTo(Gap);

// sentence right option
Option.hasOne(Gap, {
    foreignKey: 'rightOptionId',
    as: 'rightAnswerTo',
    constraints: false,
});
Gap.belongsTo(Option, {
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
    foreignKey: 'activeLessonId',
    as: 'tasks'
});
ActiveTask.belongsTo(ActiveLesson, {
    foreignKey: 'activeLessonId',
    as: 'lesson'
});

ActiveTask.hasMany(ActiveGap, {
    foreignKey: 'activeTaskId',
    as: 'gaps'
});
ActiveGap.belongsTo(ActiveTask, {
    foreignKey: 'activeTaskId',
    as: 'task'
});

// active sentence available options
ActiveGap.hasMany(ActiveOption, {
    foreignKey: 'activeGapId',
    as: 'options'
});
ActiveOption.belongsTo(ActiveGap, {
    foreignKey: 'activeGapId',
    as: 'gap'
});

// right option of an active sentence
ActiveOption.hasOne(ActiveGap, {
    foreignKey: "rightOptionId",
    as: 'rightAnswerTo',
    constraints: false,
});
ActiveGap.belongsTo(ActiveOption, {
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
ActiveGap.hasMany(StudentAnswer, {
    foreignKey: 'answerToId',
    as: 'studentsAnswers'
});
StudentAnswer.belongsTo(ActiveGap, {
    foreignKey: 'answerToId',
    as: 'answerTo'
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
    Gap,
    Option,
    ActiveLesson,
    ActiveTask,
    ActiveGap,
    ActiveOption,
    StudentAnswerSheet,
    StudentAnswer
}
