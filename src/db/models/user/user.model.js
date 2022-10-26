const {UserTypeEnum, UserRoleEnum} = require('../../../utils');


module.exports = (sequelize, DataTypes) => sequelize.define('user', {
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
    name: {
        type: DataTypes.STRING,
        defaultValue: "Name",
    }
});
