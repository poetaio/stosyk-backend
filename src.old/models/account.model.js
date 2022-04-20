const AccountRole = require('./utils/AccountRoleEnum.model');

// id + role
module.exports = (sequelize, DataTypes) => sequelize.define('account', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    role: {
        type: AccountRole(sequelize, DataTypes),
        defaultValue: 'TEACHER',
        allowNull: false
    }
});
