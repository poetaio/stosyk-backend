const allSchoolsByTeacherIdInclude = require('./allSchoolsByTeacherId.include');
const allSchoolsByStudentIdInclude = require('./allSchoolsByStudentId.include');
const allSeatsBySchoolIdInclude = require('./allSeatsBySchoolId.include');
const allSeatsByStudentEmailInclude = require('./allSeatsByStudentEmail.include');

module.exports = {
    allSchoolsByTeacherIdInclude,
    allSeatsBySchoolIdInclude,
    allSeatsByStudentEmailInclude,
    allSchoolsByStudentIdInclude,
};
