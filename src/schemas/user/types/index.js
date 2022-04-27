const student = require('./student');
const teacher = require('./teacher');
const auth = require('./auth');


module.exports = {
    ...teacher,
    ...student,
    ...auth,
};
