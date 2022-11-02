const LessonStudent = require('./lessonStudent.model');
const LessonTeacher = require('./lessonTeacher.model');
const TaskListTask = require('./taskListTask.model');
const TaskSentence = require('./taskSentence.model');
const SentenceGap = require('./sentenceGap.model');
const GapOption = require('./gapOption.model');
const StudentOption = require('./studentOption.model');
const TaskAttachments = require('./taskAttachment.model')
const LessonCourse = require('./lessonCourse.model')
const TeacherCourse = require('./teacherCourse.model')
const SchoolTeacher = require('./schoolTeacher.model')
const SchoolStudent = require('./schoolStudent.model')


module.exports = (sequelize, DataTypes) => ({
    LessonStudent: LessonStudent(sequelize, DataTypes),
    LessonTeacher: LessonTeacher(sequelize, DataTypes),
    TaskListTask: TaskListTask(sequelize, DataTypes),
    TaskSentence: TaskSentence(sequelize, DataTypes),
    SentenceGap: SentenceGap(sequelize, DataTypes),
    GapOption: GapOption(sequelize, DataTypes),
    StudentOption: StudentOption(sequelize, DataTypes),
    TaskAttachments: TaskAttachments(sequelize, DataTypes),
    LessonCourse: LessonCourse(sequelize, DataTypes),
    TeacherCourse: TeacherCourse(sequelize, DataTypes),
    SchoolTeacher: SchoolTeacher(sequelize, DataTypes),
    SchoolStudent: SchoolStudent(sequelize, DataTypes),
});
