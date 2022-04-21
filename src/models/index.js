const { DataTypes } = require('sequelize');
const { sequelize } = require('../services');

const {
    Account,
    User,
    Teacher,
    Student
} = require('./user')(sequelize, DataTypes);

const {
    Lesson,
    TaskList,
    Task,
    Sentence,
    Gap,
    Option
} = require('./lesson')(sequelize, DataTypes);

const {
    LessonStudent,
    LessonTeacher,
    TaskListTask,
    TaskSentence,
    SentenceGap,
    GapOption,
    StudentOption,
} = require('./relations')(sequelize, DataTypes);

//User-Account One-to-One relationship

User.hasOne(Account, {
    foreignKey: {
        name: 'userId',
        unique: true
    },
    as: 'account'
});
Account.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        unique: true
    },
    as: 'user'
});

//User-Teacher One-to-One relationship

User.hasOne(Teacher, {
    foreignKey: {
        name: 'userId',
        unique: true
    },
    as: 'teacher'
})
Teacher.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        unique: true
    },
    as: 'user'
});

//User-Student One-to-One relationship

User.hasOne(Student, {
    foreignKey: {
        name: 'userId',
        unique: true
    },
    as: 'student'
})
Student.belongsTo(User, {
    foreignKey: {
        name: 'userId',
        unique: true
    },
    as: 'user'
});

//Teacher-Lesson One-to-Many relationship

Teacher.hasMany(LessonTeacher, {
    foreignKey: 'teacherId',
    as: 'lessonTeachers'
});
LessonTeacher.belongsTo(Teacher, {
    foreignKey: 'teacherId',
    as: 'ltteacher'
});
Lesson.hasOne(LessonTeacher, {
    foreignKey: {
        name: 'lessonId',
        unique: true
    },
    as: 'llessonTeacher'
});
LessonTeacher.belongsTo(Lesson, {
    foreignKey: {
        name: 'lessonId',
        unique: true
    },
    as: 'ltlesson'
});

//Lesson-Task list One-to-One relationship

Lesson.hasOne(TaskList, {
    foreignKey: {
        name: 'lessonId',
        unique: true
    },
    as: 'taskList'
})
TaskList.belongsTo(Lesson, {
    foreignKey: {
        name: 'lessonId',
        unique: true
    },
    as: 'lesson'
});

//TaskList-Task One-to-Many relationship

TaskList.hasMany(TaskListTask, {
    foreignKey: 'taskListId',
    as: 'taskListTasks'
});
TaskListTask.belongsTo(TaskList, {
    foreignKey: 'taskListId',
    as: 'taskList'
});
Task.hasOne(TaskListTask, {
    foreignKey: {
        name: 'taskId',
        unique: true
    },
    as: 'taskListTask'
});
TaskListTask.belongsTo(Task, {
    foreignKey: {
        name: 'taskId',
        unique: true
    },
    as: 'task'
});

//Task-Sentence One-to-Many relationship

Task.hasMany(TaskSentence, {
    foreignKey: 'taskId',
    as: 'taskSentences'
});
TaskSentence.belongsTo(Task, {
    foreignKey: 'taskId',
    as: 'task'
});
Sentence.hasOne(TaskSentence, {
    foreignKey: {
        name: 'sentenceId',
        unique: true
    },
    as: 'taskSentence'
});
TaskSentence.belongsTo(Sentence, {
    foreignKey: {
        name: 'sentenceId',
        unique: true
    },
    as: 'sentence'
});

//Sentence-Gap One-to-Many relationship

Sentence.hasMany(SentenceGap, {
    foreignKey: 'sentenceId',
    as: 'sentenceGaps'
});
SentenceGap.belongsTo(Sentence, {
    foreignKey: 'sentenceId',
    as: 'sentence'
});
Gap.hasOne(SentenceGap, {
    foreignKey: {
        name: 'gapId',
        unique: true
    },
    as: 'sentenceGap'
});
SentenceGap.belongsTo(Gap, {
    foreignKey: {
        name: 'gapId',
        unique: true
    },
    as: 'gap'
});

//Gap-Answer One-to-Many relationship

Gap.hasMany(GapOption, {
    foreignKey: 'gapId',
    as: 'gapOptions'
});
GapOption.belongsTo(Gap, {
    foreignKey: 'gapId',
    as: 'gap'
});
Option.hasOne(GapOption, {
    foreignKey: {
        name: 'optionId',
        unique: true
    },
    as: 'gapOption'
});
GapOption.belongsTo(Option, {
    foreignKey: {
        name: 'optionId',
        unique: true
    },
    as: 'option'
});

//Student-Answers Many-to-Many relationship

Student.belongsToMany(Option, {
    through: StudentOption,
    foreignKey: 'studentId',
    as: 'studentOptions'
});
Option.belongsToMany(Student, {
    through: StudentOption,
    foreignKey: 'optionId',
    as: 'optionStudents'
});

// Student-Lesson Many-to-Many relationship

Student.belongsToMany(Lesson,{
    through: LessonStudent,
    foreignKey: "studentId",
    as: "studentLessons",
});
Lesson.belongsToMany(Student,{
    through: LessonStudent,
    foreignKey: "lessonId",
    as: "lessonStudents",
});


module.exports = {
    Account,
    User,
    Teacher,
    Student,

    Lesson,
    TaskList,
    Task,
    Sentence,
    Gap,
    Option,

    LessonStudent,
    LessonTeacher,
    TaskListTask,
    TaskSentence,
    SentenceGap,
    GapOption,
    StudentOption,
};
