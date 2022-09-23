const School = require('../school/school.model');

module.exports = (sequelize, DataTypes) => ({
    School: School(sequelize, DataTypes),
});
