const sequelize = require('../models/sequelize');
const teacherService = require('./user/teacherService');
const studentService = require('./user/studentService')
const tokenService = require('./user/tokenService');
const lessonService = require('./lesson/lessonService')
const taskService = require('./lesson/taskService')


module.exports = {
    sequelize,
    teacherService,
    studentService,
    tokenService,
    lessonService,
    taskService
};
