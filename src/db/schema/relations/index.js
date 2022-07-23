const LessonStudent = require('./lessonStudent.table');
const LessonTeacher = require('./lessonTeacher.table');
const TaskListTask = require('./taskListTask.table');
const TaskSentence = require('./taskSentence.table');
const SentenceGap = require('./sentenceGap.table');
const GapOption = require('./gapOption.table');
const StudentOption = require('./studentOption.table');
const TaskAttachments = require('./taskAttachment.table')
const TeacherCourse = require('./teacherCourse.table')
const LessonCourse = require('./lessonCourse.table')


module.exports = (DataTypes) => ({
    LessonStudentTable: LessonStudent(DataTypes),
    LessonTeacherTable: LessonTeacher(DataTypes),
    TaskListTaskTable: TaskListTask(DataTypes),
    TaskSentenceTable: TaskSentence(DataTypes),
    SentenceGapTable: SentenceGap(DataTypes),
    GapOptionTable: GapOption(DataTypes),
    StudentOptionTable: StudentOption(DataTypes),
    TaskAttachmentsTable: TaskAttachments(DataTypes),
    TeacherCourseTable: TeacherCourse(DataTypes),
    LessonCourseTable: LessonCourse(DataTypes),
});
