const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const queries = require('./queries');
const includes = require('./includes');

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
    Option,
    Course,
    Homework,
    School,
} = require('./lesson')(sequelize, DataTypes);

const {
    LessonStudent,
    LessonTeacher,
    TaskListTask,
    TaskSentence,
    SentenceGap,
    GapOption,
    StudentOption,
    TaskAttachments,
    LessonCourse,
    TeacherCourse,
    SchoolTeacher,
    SchoolStudentSeat,
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
    hooks: true,
});
LessonTeacher.belongsTo(Lesson, {
    foreignKey: {
        name: 'lessonId',
        unique: true,
    },
    as: 'lessonTeacherLesson',
});


//TaskList-Task One-to-Many relationship
const LessonTeacherRelation = Lesson.belongsToMany(Teacher, {
    through: LessonTeacher,
    foreignKey: 'lessonId',
    as: 'teacher',
});
Teacher.belongsToMany(Lesson, {
    through: LessonTeacher,
    foreignKey: 'teacherId',
    as: 'lessons'
});
LessonTeacherRelation.isMultiAssociation = false;
LessonTeacherRelation.isSingleAssociation = true;

//Course-Lesson One-to-Many relationship
Course.belongsToMany(Lesson, {
    foreignKey: 'courseId',
    as: 'courseLessons',
    through: LessonCourse,
});
Lesson.belongsToMany(Course, {
    foreignKey: 'lessonId',
    as: 'lessonCourses',
    through: LessonCourse,

});

//Teacher-Course list One-to-Many relationship

Teacher.hasMany(TeacherCourse, {
    foreignKey: 'teacherId',
    as: 'teacherCourseTeachers'
});
TeacherCourse.belongsTo(Teacher, {
    foreignKey: 'teacherId',
    as: 'courseTeacherTeacher'
});
Course.hasOne(TeacherCourse, {
    foreignKey: {
        name: 'courseId',
        unique: true,
    },
    as: 'courseCourseTeacher',
    foreignKeyConstraint: true,
    onDelete: 'CASCADE',
    hooks: true
});
TeacherCourse.belongsTo(Course, {
    foreignKey: {
        name: 'courseId',
        unique: true,
    },
    as: 'courseTeacherCourse',
});

Teacher.belongsToMany(Course, {
    through: TeacherCourse,
    foreignKey: 'teacherId',
    as: 'courses',
});
const TeacherCourseRelation = Course.belongsToMany(Teacher, {
    through: TeacherCourse,
    foreignKey: 'courseId',
    as: 'teacher'
});
TeacherCourseRelation.isMultiAssociation = false;
TeacherCourseRelation.isSingleAssociation = true;

//Lesson-Task list One-to-One relationship

Lesson.hasMany(TaskList, {
    foreignKey: 'lessonId',
    as: 'lessonTaskList',
    foreignKeyConstraint: true,
    onDelete: 'CASCADE',
    hooks: true
})
TaskList.belongsTo(Lesson, {
    foreignKey: 'lessonId',
    as: 'taskListLesson'
});

//TaskList-Task One-to-Many relationship
TaskList.belongsToMany(Task, {
    through: TaskListTask,
    foreignKey: 'taskListId',
    as: 'task',
});
const TaskListTaskRelation = Task.belongsToMany(TaskList, {
    through: TaskListTask,
    foreignKey: 'taskId',
    as: 'taskList'
});
TaskListTaskRelation.isMultiAssociation = false;
TaskListTaskRelation.isSingleAssociation = true;

TaskList.hasMany(TaskListTask, {
    foreignKey: 'taskListId',
    as: 'taskListTaskListTasks',
    foreignKeyConstraint: true,
    onDelete: 'CASCADE',
    hooks: true
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
    as: 'taskTaskListTask',
    foreignKeyConstraint: true,
    onDelete: 'CASCADE',
    hooks: true
});
TaskListTask.belongsTo(Task, {
    foreignKey: {
        name: 'taskId',
        unique: true
    },
    as: 'taskListTaskTask'
});

//Task-Sentence One-to-Many relationship
Task.belongsToMany(Sentence, {
    through: TaskSentence,
    foreignKey: 'taskId',
    as: 'sentences',
});
const TaskSentenceRelation = Sentence.belongsToMany(Task, {
    through: TaskSentence,
    foreignKey: 'sentenceId',
    as: 'task'
});
TaskSentenceRelation.isMultiAssociation = false;
TaskSentenceRelation.isSingleAssociation = true;

Task.hasMany(TaskSentence, {
    foreignKey: 'taskId',
    as: 'taskTaskSentences',
    foreignKeyConstraint: true,
    onDelete: 'CASCADE',
    hooks: true
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
    as: 'sentenceTaskSentence',
    foreignKeyConstraint: true,
    onDelete: 'CASCADE',
    hooks: true
});
TaskSentence.belongsTo(Sentence, {
    foreignKey: {
        name: 'sentenceId',
        unique: true
    },
    as: 'taskSentenceSentence'
});

Task.hasMany(TaskAttachments, {
    foreignKey: 'taskId',
    as: 'taskAttachments',
    foreignKeyConstraint: true,
    onDelete: 'CASCADE',
    hooks: true
});
TaskAttachments.belongsTo(Task,{
    foreignKey: 'taskId',
    as: 'taskAttachments'
})

//Sentence-Gap One-to-Many relationship
Sentence.belongsToMany(Gap, {
    through: SentenceGap,
    foreignKey: 'sentenceId',
    as: 'gaps',
});
const SentenceGapRelation = Gap.belongsToMany(Sentence, {
    through: SentenceGap,
    foreignKey: 'gapId',
    as: 'sentence'
});
SentenceGapRelation.isMultiAssociation = false;
SentenceGapRelation.isSingleAssociation = true;

Sentence.hasMany(SentenceGap, {
    foreignKey: 'sentenceId',
    as: 'sentenceSentenceGaps',
    foreignKeyConstraint: true,
    onDelete: 'CASCADE',
    hooks: true
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
    as: 'gapSentenceGap',
    foreignKeyConstraint: true,
    onDelete: 'CASCADE',
    hooks: true
});
SentenceGap.belongsTo(Gap, {
    foreignKey: {
        name: 'gapId',
        unique: true
    },
    as: 'sentenceGapGap'
});

//Gap-Option One-to-Many relationship
Gap.belongsToMany(Option, {
    through: GapOption,
    foreignKey: 'gapId',
    as: 'options',
});
const GapOptionRelation = Option.belongsToMany(Gap, {
    through: GapOption,
    foreignKey: 'optionId',
    as: 'gap'
});
GapOptionRelation.isMultiAssociation = false;
GapOptionRelation.isSingleAssociation = true;

Gap.hasMany(GapOption, {
    foreignKey: 'gapId',
    as: 'gapGapOptions',
    foreignKeyConstraint: true,
    onDelete: 'CASCADE',
    hooks: true
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
    as: 'optionGapOption',
    foreignKeyConstraint: true,
    onDelete: 'CASCADE',
    hooks: true
});
GapOption.belongsTo(Option, {
    foreignKey: {
        name: 'optionId',
        unique: true
    },
    as: 'gapOptionOption'
});

//Student-Option Many-to-Many relationship
Student.belongsToMany(Option, {
    through: StudentOption,
    foreignKey: 'studentId',
    as: 'options'
});
Option.belongsToMany(Student, {
    through: StudentOption,
    foreignKey: 'optionId',
    as: 'students'
});

StudentOption.belongsTo(Option, {
    foreignKey: 'optionId',
    as: 'option',
});
StudentOption.belongsTo(Student, {
    foreignKey: 'studentId',
    as: 'student',
});

Option.hasMany(StudentOption, {
    foreignKey: "optionId",
    as: "optionStudentOptions",
});
Student.hasMany(StudentOption, {
    foreignKey: "studentId",
    as: "studentOptions",
});

Sentence.hasOne(StudentOption, {
    foreignKey: "sentenceId",
    as: "sentenceStudentOption",
});
StudentOption.belongsTo(Sentence, {
    foreignKey: "sentenceId",
    as: "studentOptionSentence",
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

Lesson.hasMany(Homework, {
    foreignKey: 'lessonId',
    as: 'homeworks',
});
Homework.belongsTo(Lesson, {
    foreignKey: 'lessonId',
    as: 'lesson',
});

Homework.hasOne(TaskList, {
    foreignKey: 'homeworkId',
    as: 'taskList',
});
TaskList.belongsTo(Homework, {
    foreignKey: 'homeworkId',
    as: 'homework',
});

School.hasMany(Lesson, {
    foreignKey: 'schoolId',
    as: 'lessons',
});
Lesson.belongsTo(School, {
    foreignKey: 'schoolId',
    as: 'school',
});

School.hasMany(Course, {
    foreignKey: 'schoolId',
    as: 'courses',
});
Course.belongsTo(School, {
    foreignKey: 'schoolId',
    as: 'school',
});

School.belongsToMany(Teacher, {
    through: SchoolTeacher,
    foreignKey: 'schoolId',
    as: 'teachers',
});
Teacher.belongsToMany(School, {
    through: SchoolTeacher,
    foreignKey: 'teacherId',
    as: 'schools',
});

School.belongsToMany(Student, {
    through: SchoolStudentSeat,
    foreignKey: 'schoolId',
    as: 'students',
});
Student.belongsToMany(School, {
    through: SchoolStudentSeat,
    foreignKey: 'studentId',
    as: 'schools',
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
    Course,
    Homework,
    School,

    LessonStudent,
    LessonTeacher,
    TaskListTask,
    TaskSentence,
    SentenceGap,
    GapOption,
    StudentOption,
    TaskAttachments,
    TeacherCourse,
    LessonCourse,
    SchoolTeacher,
    SchoolStudentSeat,

    ...queries,
    ...includes
};
