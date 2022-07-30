const School = require('../school/school.table');

module.exports = (DataTypes) => ({
    SchoolTable: School(DataTypes),
});
