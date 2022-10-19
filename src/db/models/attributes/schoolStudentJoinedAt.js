const Sequelize = require("sequelize");

module.exports = [
    Sequelize.col('seats.joinedAt'),
    'joinedAt',
];
