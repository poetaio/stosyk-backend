const lessonTables = require('./lesson');
const userTables = require('./user');
const relationTables = require('./relations');
const schoolTables = require('./school');

module.exports = (DataTypes) => ({
    ...lessonTables(DataTypes),
    ...userTables(DataTypes),
    ...relationTables(DataTypes),
    ...schoolTables(DataTypes),
});
