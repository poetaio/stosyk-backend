const allStudentsByHomeworkIdInclude = require('./allStudentsByHomeworkId.include');
const studentBySeatId = require('./studentBySeatId.include');
const allStudentsBySchoolIdInclude = require('./allStudentsBySchoolId.include');
const studentEmailInclude = require('./studentEmail.include');
const allStudentsByLessonIdInclude = require('./allStudentsByLessonId.include');
const allStudentsByCourseIdInclude = require('./allStudentsByCourseId.include');

module.exports = {
    allStudentsByHomeworkIdInclude,
    studentBySeatId,
    allStudentsBySchoolIdInclude,
    studentEmailInclude,
    allStudentsByLessonIdInclude,
    allStudentsByCourseIdInclude,
};
