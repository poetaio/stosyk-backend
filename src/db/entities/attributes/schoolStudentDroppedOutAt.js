const Sequelize = require("sequelize");

module.exports = [
    Sequelize.col('schoolStudents.droppedOutAt'),
    'droppedOutAt',
];
