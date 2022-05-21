const lessonInclude = require('./lesson.include');
const gapExistsByGapIdAndStudentIdInclude = require('./gapExistsByGapIdAndStudentId.include');
const studentOnLessonInclude = require('./studentOnLesson.include');
const lessonGapsInclude = require('./lessonStudentsAnswers.include');
const lessonCorrectAnswersInclude = require('./lessonCorrectAnswers.include');
const taskWithLessonInclude = require('./taskWithLesson.include');
const lessonTasksInclude = require('./lessonTasks.include');
const lessonShownTasksInclude = require('./lessonShownTasks.include');
const lessonShownTasksNewInclude = require('./lessonShownTasksNew.include');
const optionIncludes = require('./option');
const sentencesIncludes = require('./sentence');
const gapIncludes = require('./gap');
const taskIncludes = require('./task');

module.exports = {
    lessonInclude,
    gapExistsByGapIdAndStudentIdInclude,
    studentOnLessonInclude,
    lessonGapsInclude,
    lessonCorrectAnswersInclude,
    lessonShownTasksNewInclude,
    taskWithLessonInclude,
    lessonTasksInclude,
    lessonShownTasksInclude,
    ...sentencesIncludes,
    ...gapIncludes,
    ...optionIncludes,
    ...taskIncludes,
};
