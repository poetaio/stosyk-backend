const taskGapsInclude = require('./taskGaps.include');
const allGapsByHWIdInclude = require('./allGapsByHWId.include');
const allAnsweredGapsByHWIdAndStudentIdInclude = require('./allAnsweredGapsByHWIdAndStudentId.include')
const allCorrectAnsweredGapsByHWIdAndStudentIdInclude = require('./allCorrectAnsweredGapsByHWId.include')
const allGapsByLessonIdInclude = require('./allGapsByLessonId.include');
const allAnsweredGapsByLessonIdAndStudentIdInclude = require('./allAnsweredGapsByLessonIdAndStudentId.include')
const allCorrectAnsweredGapsByLessonIdAndStudentIdInclude = require('./allCorrectAnsweredGapsByLessonId.include')
const allGapsWithAnswersShownInclude = require('./allGapsWithAnswersShown.include');

module.exports = {
    taskGapsInclude,
    allGapsByHWIdInclude,
    allAnsweredGapsByHWIdAndStudentIdInclude,
    allCorrectAnsweredGapsByHWIdAndStudentIdInclude,
    allGapsByLessonIdInclude,
    allAnsweredGapsByLessonIdAndStudentIdInclude,
    allCorrectAnsweredGapsByLessonIdAndStudentIdInclude,
    allGapsWithAnswersShownInclude,
};
