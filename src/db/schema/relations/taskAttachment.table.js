const attachmentTypeEnum = require('../../../utils/enums/attachmentType.enum')
const TaskTable = require("../lesson/task.table");

module.exports = (DataTypes) => ['taskAttachments', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    source: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    contentType: {
        type: DataTypes.ENUM(...Object.values(attachmentTypeEnum)),
    },
    taskId: {
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: TaskTable(DataTypes)[0],
            key: 'taskId',
        }
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
}];