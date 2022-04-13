const TeacherActiveLessonType = require('./teacher/TeacherActiveLesson.type');
const { StudentActiveLessonType, StudentAnswerSheetType, StudentJoinedLessonType, ActiveLessonStatusChangedType } = require('./student');
const ActiveLessonStatusEnumType = require('./ActiveLessonStatusEnum.type');
const StudentEnteredAnswerType = require('./teacher/StudentEnteredAnswer.type');
const ChangeStudentAnswerType = require('./student/ChangeStudentAnswer.type');

module.exports = {
    TeacherActiveLessonType,

    StudentAnswerSheetType,
    StudentActiveLessonType,
    StudentJoinedLessonType,
    ActiveLessonStatusChangedType,

    ActiveLessonStatusEnumType,
    StudentEnteredAnswerType,
    ChangeStudentAnswerType
};
