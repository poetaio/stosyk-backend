const lessonInclude = require('./lessonInclude');
const shortLessonInclude = require('./shortLessonInclude');
const studentActiveLessonInclude = require('./studentActiveLessonInclude');
const teacherActiveLessonInclude = require('./teacherActiveLessonInclude');
const studentGapInclude = require('./studentGapInclude');
const teacherGapInclude = require('./teacherGapInclude');
const studentTaskInclude = require('./studentTaskInclude');
const teacherTaskInclude = require('./teacherTaskInclude');
const studentAnswerSheetInclude = require('./studentAnswerSheetInclude');
const studentAnswerSheetIfLessonStartedInclude = require('./studentAnswerSheetIfLessonStartedInclude')


module.exports = {
    lessonInclude,
    shortLessonInclude,
    studentActiveLessonInclude,
    teacherActiveLessonInclude,
    studentGapInclude,
    teacherGapInclude,
    studentTaskInclude,
    teacherTaskInclude,
    studentAnswerSheetInclude,
    studentAnswerSheetIfLessonStartedInclude
};
