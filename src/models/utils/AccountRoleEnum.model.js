const AccountRoleEnum = require('./AccountRoleEnum');

module.exports = (sequelize, DataTypes) => DataTypes.ENUM(
    ...Object.values(AccountRoleEnum)
);
