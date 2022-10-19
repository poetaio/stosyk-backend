const studentSeatTypes = require('./student_seat');
const TeacherSchoolType = require('./TeacherSchool.type');
const StudentSchoolType = require('./StudentSchool.type');
const SchoolShortType = require('./SchoolShort.type');
const StudentSchoolStatusEnumType = require('./StudentSchoolStatusEnum.type');

module.exports = {
    ...studentSeatTypes,

    TeacherSchoolType,
    StudentSchoolType,
    SchoolShortType,
    StudentSchoolStatusEnumType,
};
