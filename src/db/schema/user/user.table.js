const {UserRoleEnum, UserTypeEnum} = require('../../../utils');


module.exports = (DataTypes) => ['users', {
    userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    role: {
        type: DataTypes.ENUM(...Object.values(UserRoleEnum)),
        defaultValue: UserRoleEnum.STUDENT
    },
    type: {
        type: DataTypes.ENUM(...Object.values(UserTypeEnum)),
        defaultValue: UserTypeEnum.ANONYMOUS
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
}];
