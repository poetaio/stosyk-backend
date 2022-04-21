module.exports = (sequelize, DataTypes) => sequelize.define(
    'account',
    {
        id: {
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
        }
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
