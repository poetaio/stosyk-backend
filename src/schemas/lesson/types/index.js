const { StudentLessonType, TeacherLessonType, LessonInputType, LessonCorrectAnswersType } = require('./lesson');
const { TaskStudentsAnswersType, TeacherTaskType, StudentTaskType } = require('./task');
const { AnswerInputType } = require('./option');


module.exports = {
    StudentLessonType,
    TeacherLessonType,
    StudentTaskType,
    TeacherTaskType,
    LessonInputType,
    TaskStudentsAnswersType,

    AnswerInputType,
    LessonCorrectAnswersType
};
