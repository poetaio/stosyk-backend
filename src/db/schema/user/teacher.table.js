const UserTable = require("./user.table");

module.exports = (DataTypes) => ['teachers', {
    teacherId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
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
