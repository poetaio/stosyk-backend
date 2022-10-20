const School = require('./school.model');
const SchoolInvitation = require('./schoolInvitation.model');

module.exports = (sequelize, DataTypes) => ({
    School: School(sequelize, DataTypes),
    SchoolInvitation: SchoolInvitation(sequelize, DataTypes),
});
