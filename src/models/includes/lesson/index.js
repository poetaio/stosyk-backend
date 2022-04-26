const lessonInclude = require('./lesson.include');
const gapExistsByGapIdAndStudentIdInclude = require('./gapExistsByGapIdAndStudentId.include');
const studentOnLessonInclude = require('./studentOnLesson.include');
const lessonGapsInclude = require('./lessonStudentsAnswers.include');

module.exports = {
    lessonInclude,
    gapExistsByGapIdAndStudentIdInclude,
    studentOnLessonInclude,
    lessonGapsInclude
};
