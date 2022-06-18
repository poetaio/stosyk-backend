const { migrationConfig } = require('sequelize-pg-utilities');

const config = require('./config.js');
module.exports = migrationConfig(config);
