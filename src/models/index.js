const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

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
    as: 'teacherLessonTeachers'
});
LessonTeacher.belongsTo(Teacher, {
    foreignKey: 'teacherId',
    as: 'lessonTeacherTeacher'
});
Lesson.hasOne(LessonTeacher, {
    foreignKey: {
        name: 'lessonId',
        unique: true,
    },
    as: 'lessonLessonTeacher',
    foreignKeyConstraint: true,
    onDelete: 'CASCADE',
    hooks: true
});
LessonTeacher.belongsTo(Lesson, {
    foreignKey: {
        name: 'lessonId',
        unique: true,
    },
    as: 'lessonTeacherLesson',
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
    as: 'taskListTaskListTasks'
});
TaskListTask.belongsTo(TaskList, {
    foreignKey: 'taskListId',
    as: 'taskListTaskTaskList'
});
Task.hasOne(TaskListTask, {
    foreignKey: {
        name: 'taskId',
        unique: true
    },
    as: 'taskTaskListTask'
});
TaskListTask.belongsTo(Task, {
    foreignKey: {
        name: 'taskId',
        unique: true
    },
    as: 'taskListTaskTask'
});

//Task-Sentence One-to-Many relationship

Task.hasMany(TaskSentence, {
    foreignKey: 'taskId',
    as: 'taskTaskSentences'
});
TaskSentence.belongsTo(Task, {
    foreignKey: 'taskId',
    as: 'taskSentenceTask'
});
Sentence.hasOne(TaskSentence, {
    foreignKey: {
        name: 'sentenceId',
        unique: true
    },
    as: 'sentenceTaskSentence'
});
TaskSentence.belongsTo(Sentence, {
    foreignKey: {
        name: 'sentenceId',
        unique: true
    },
    as: 'taskSentenceSentence'
});

//Sentence-Gap One-to-Many relationship

Sentence.hasMany(SentenceGap, {
    foreignKey: 'sentenceId',
    as: 'sentenceSentenceGaps'
});
SentenceGap.belongsTo(Sentence, {
    foreignKey: 'sentenceId',
    as: 'sentenceGapSentence'
});
Gap.hasOne(SentenceGap, {
    foreignKey: {
        name: 'gapId',
        unique: true
    },
    as: 'gapSentenceGap'
});
SentenceGap.belongsTo(Gap, {
    foreignKey: {
        name: 'gapId',
        unique: true
    },
    as: 'sentenceGapGap'
});

//Gap-Answer One-to-Many relationship

Gap.hasMany(GapOption, {
    foreignKey: 'gapId',
    as: 'gapGapOptions'
});
GapOption.belongsTo(Gap, {
    foreignKey: 'gapId',
    as: 'gapOptionGap'
});
Option.hasOne(GapOption, {
    foreignKey: {
        name: 'optionId',
        unique: true
    },
    as: 'optionGapOption'
});
GapOption.belongsTo(Option, {
    foreignKey: {
        name: 'optionId',
        unique: true
    },
    as: 'gapOptionOption'
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
    sequelize,

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
