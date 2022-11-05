const studentIncludes = require('./student');
const teacherIncludes = require('./teacher');
const studentAccountInclude = require('./studentAccount.include');

module.exports = {
    ...studentIncludes,
    ...teacherIncludes,

    studentAccountInclude,
};
