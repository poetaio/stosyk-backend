const studentIncludes = require('./student');
const studentAccountInclude = require('./studentAccount.include');

module.exports = {
    ...studentIncludes,

    studentAccountInclude,
};
