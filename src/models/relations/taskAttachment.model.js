const attachmentTypeEnum = require('../../utils/enums/attachmentType.enum')

module.exports = (sequelize, DataTypes) => sequelize.define('taskAttachments', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contentType: {
        type: DataTypes.ENUM(...Object.values(attachmentTypeEnum)),
    }
});