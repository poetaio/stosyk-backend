const lessonTables = require('./lesson');
const userTables = require('./user');
const relationTables = require('./relations');

module.exports = (DataTypes) => ({
    ...lessonTables(DataTypes),
    ...userTables(DataTypes),
    ...relationTables(DataTypes),
});
