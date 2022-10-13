const studentSeatTypes = require('./student_seat');
const SchoolType = require('./School.type');

module.exports = {
    ...studentSeatTypes,

    SchoolType,
};
