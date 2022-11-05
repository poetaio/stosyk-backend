const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');
const queries = require('./queries');
const includes = require('./includes');
const attributes = require('./attributes');

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
    LessonMarkup,
} = require('./lesson')(sequelize, DataTypes);

const {
    School,
    SchoolInvitation,
} = require('./school')(sequelize, DataTypes);

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
    SchoolStudent,
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


//Lesson-Teacher One-to-Many relationship
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
Course.belongsToMany(LessonMarkup, {
    foreignKey: 'courseId',
    as: 'lessons',
    through: LessonCourse,
});
LessonMarkup.belongsToMany(Course, {
    foreignKey: 'lessonId',
    as: 'courses',
    through: LessonCourse,
});

LessonCourse.belongsTo(LessonMarkup, {
    foreignKey: 'lessonId',
    as: 'lesson',
});
LessonMarkup.hasMany(LessonCourse, {
    foreignKey: 'lessonId',
    as: 'lessonCourses'
});

LessonCourse.belongsTo(Course, {
    foreignKey: 'courseId',
    as: 'course',
});
Course.hasMany(LessonCourse, {
    foreignKey: 'courseId',
    as: 'lessonCourses'
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

Lesson.hasOne(TaskList, {
    foreignKey: 'lessonId',
    as: 'taskList',
    foreignKeyConstraint: true,
    onDelete: 'CASCADE',
    hooks: true,
})
TaskList.belongsTo(Lesson, {
    foreignKey: 'lessonId',
    as: 'lesson'
});

//TaskList-Task One-to-Many relationship
TaskList.belongsToMany(Task, {
    through: TaskListTask,
    foreignKey: 'taskListId',
    as: 'tasks',
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
    foreignKey: 'taskId',
    as: 'taskTaskListTask',
    foreignKeyConstraint: true,
    onDelete: 'CASCADE',
    hooks: true
});
TaskListTask.belongsTo(Task, {
    foreignKey: 'taskId',
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
    as: 'attachments',
    foreignKeyConstraint: true,
    onDelete: 'CASCADE',
    hooks: true
});
TaskAttachments.belongsTo(Task,{
    foreignKey: 'taskId',
    as: 'task'
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

Homework.belongsTo(Homework, {
    foreignKey: 'homeworkMarkupId',
    as: 'homeworkMarkup',
});
Homework.hasMany(Homework, {
    foreignKey: 'homeworkMarkupId',
    as: 'homeworks',
});

Homework.hasOne(TaskList, {
    foreignKey: 'homeworkId',
    as: 'taskList',
});
TaskList.belongsTo(Homework, {
    foreignKey: 'homeworkId',
    as: 'homework',
});

LessonMarkup.hasMany(Lesson, {
    foreignKey: 'lessonMarkupId',
    as: 'lessons',
});
Lesson.belongsTo(LessonMarkup, {
    foreignKey: 'lessonMarkupId',
    as: 'lessonMarkup',
});

LessonMarkup.hasOne(TaskList, {
    foreignKey: 'lessonMarkupId',
    as: 'taskList',
    foreignKeyConstraint: true,
    onDelete: 'CASCADE',
    hooks: true
});
TaskList.belongsTo(LessonMarkup, {
    foreignKey: 'lessonMarkupId',
    as: 'lessonMarkup'
});

LessonMarkup.hasMany(Homework, {
    foreignKey: 'lessonMarkupId',
    as: 'homeworks',
});
Homework.belongsTo(LessonMarkup, {
    foreignKey: 'lessonMarkupId',
    as: 'lessonMarkup',
});

Teacher.hasMany(LessonMarkup, {
    foreignKey: 'teacherId',
    as: 'lessonMarkups',
});
LessonMarkup.belongsTo(Teacher, {
    foreignKey: 'teacherId',
    as: 'teacher',
});
School.hasMany(LessonMarkup, {
    foreignKey: 'schoolId',
    as: 'lessons',
});
LessonMarkup.belongsTo(School, {
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

Teacher.hasMany(SchoolTeacher, {
    foreignKey: 'teacherId',
    as: 'schoolTeachers',
});
SchoolTeacher.belongsTo(Teacher, {
    foreignKey: 'teacherId',
    as: 'teacher',
});

School.hasMany(SchoolTeacher, {
    foreignKey: 'schoolId',
    as: 'schoolTeachers',
});
SchoolTeacher.belongsTo(School, {
    foreignKey: 'schoolId',
    as: 'school',
});

School.belongsToMany(Student, {
    through: SchoolStudent,
    foreignKey: 'schoolId',
    as: 'students',
});
Student.belongsToMany(School, {
    through: SchoolStudent,
    foreignKey: 'studentId',
    as: 'schools',
});

Student.hasMany(SchoolStudent, {
    foreignKey: 'studentId',
    as: 'schoolStudents',
});
SchoolStudent.belongsTo(Student, {
    foreignKey: 'studentId',
    as: 'student',
});

School.hasMany(SchoolStudent, {
    foreignKey: 'schoolId',
    as: 'schoolStudents',
});
SchoolStudent.belongsTo(School, {
    foreignKey: 'schoolId',
    as: 'school',
});

SchoolInvitation.belongsTo(School, {
    foreignKey: 'schoolId',
    as: 'school',
});
School.hasMany(SchoolInvitation, {
    foreignKey: 'schoolId',
    as: 'invitations',
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
    LessonMarkup,

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
    SchoolStudent,
    SchoolInvitation,

    ...queries,
    // ...includes,
    // ...attributes,
};
