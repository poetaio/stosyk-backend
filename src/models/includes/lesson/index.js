const lessonInclude = require('./lesson.include');
const gapExistsByGapIdAndStudentIdInclude = require('./gapExistsByGapIdAndStudentId.include');
const studentOnLessonInclude = require('./studentOnLesson.include');
const lessonGapsInclude = require('./lessonStudentsAnswers.include');
const lessonCorrectAnswersInclude = require('./lessonCorrectAnswers.include');
const taskWithLessonInclude = require('./taskWithLesson.include');
const lessonTasksInclude = require('./lessonTasks.include');
const lessonShownTasksInclude = require('./lessonShownTasks.include');

module.exports = {
    lessonInclude,
    gapExistsByGapIdAndStudentIdInclude,
    studentOnLessonInclude,
    lessonGapsInclude,
    lessonCorrectAnswersInclude,
    taskWithLessonInclude,
    lessonTasksInclude,
    lessonShownTasksInclude
};