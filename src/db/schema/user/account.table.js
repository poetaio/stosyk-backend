const UserTable = require("./user.table");
const accountStatusEnum = require('../../../utils/enums/accountStatus.enum')
module.exports = (DataTypes) => ['accounts', {
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
    userId: {
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: UserTable(DataTypes)[0],
            key: 'userId',
        }
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
}];
