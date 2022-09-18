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
const homeworkIncludes = require('./homework');
const allCoursesByTeacherIdInclude = require('./allCoursesByTeacherId.include');
const lessonByTeacherAndTaskInclude = require('./lessonByTeacherAndTask.include');
const fullLessonInclude = require('./fullLesson.include');
const markupIncludes = require('./markup');
const courseIncludes = require('./course');
const allLessonTeacherByLessonIdInclude = require('./allLessonTeacherByLessonId.include');
const allLessonsByLessonMarkupInclude = require('./allLessonsByLessonMarkup.include');
const allLessonsByTeacherIdInclude = require('./allLessonsByTeacherId.include');
const allLessonsRunByTeacherInclude = require('./allLessonsRunByTeacher.include');
const lessonByHomeworkIdInclude = require('./lessonByHomeworkId.include');
const allLessonsBySchoolIdInclude = require('./allLessonsBySchoolId.include');
const allSchoolLessonsByTeacherIdInclude = require('./allSchoolLessonsByTeacherId.include');


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
    allCoursesByTeacherIdInclude,
    lessonByTeacherAndTaskInclude,
    fullLessonInclude,
    allLessonTeacherByLessonIdInclude,
    allLessonsByLessonMarkupInclude,
    allLessonsByTeacherIdInclude,
    allLessonsRunByTeacherInclude,
    lessonByHomeworkIdInclude,

    allLessonsBySchoolIdInclude,
    allSchoolLessonsByTeacherIdInclude,
    ...sentencesIncludes,
    ...gapIncludes,
    ...optionIncludes,
    ...taskIncludes,
    ...homeworkIncludes,
    ...markupIncludes,
    ...courseIncludes,
};
