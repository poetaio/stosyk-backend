const sequelize = require('../models/sequelize');
const teacherService = require('./teacherService');
const tokenService = require('./tokenService');


module.exports = {
    sequelize,
    teacherService,
    tokenService
};
