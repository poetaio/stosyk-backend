const sequelize = require('../models/sequelize');
const teacherService = require('./teacherService');
const studentService = require('./studentService')
const tokenService = require('./tokenService');


module.exports = {
    sequelize,
    teacherService,
    studentService,
    tokenService
};
