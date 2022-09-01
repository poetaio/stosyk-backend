const accountStatusEnum = require('../../../utils/enums/accountStatus.enum')


module.exports = (sequelize, DataTypes) => sequelize.define(
    'account',
    {
        accountId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        passwordHash: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(...Object.values(accountStatusEnum)),
            defaultValue: accountStatusEnum.UNVERIFIED,
        },
        avatar_source: {
            type: DataTypes.STRING,
        },
    },
    {
        hooks: {
            afterCreate: (record) => {
                delete record.dataValues.passwordHash;
            },
            afterUpdate: (record) => {
                delete record.dataValues.passwordHash;
            },
        }
    }
);
