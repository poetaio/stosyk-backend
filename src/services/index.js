const sequelize = require('../models/sequelize');
const lessonServices = require('./lesson')
const userServices = require('./user');


module.exports = {
    sequelize,
    ...lessonServices,
    ...userServices
};
