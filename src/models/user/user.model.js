const userRoleEnum = require('../../utils/enums/userRole.enum');
const userTypeEnum = require('../../utils/enums/userType.enum')


module.exports = (sequelize, DataTypes) => sequelize.define('user', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    role: {
        type: DataTypes.ENUM(...Object.values(userRoleEnum)),
        defaultValue: userRoleEnum.STUDENT
    },
    type: {
        type: DataTypes.ENUM(...Object.values(userTypeEnum)),
        defaultValue: userTypeEnum.ANONYMOUS
    }
});
