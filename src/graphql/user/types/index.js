const student = require('./student');
const teacher = require('./teacher');
const auth = require('./auth');
const user = require('./user')


module.exports = {
    ...teacher,
    ...student,
    ...auth,
    ...user
};
