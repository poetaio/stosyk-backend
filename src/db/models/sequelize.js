const { Sequelize } = require('sequelize');
const {configure} = require("sequelize-pg-utilities");
const config = require('../config/config');

const { name, user, password, options } = configure(config);

module.exports = new Sequelize(name, user, password, options);
