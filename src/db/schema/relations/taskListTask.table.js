const TaskTable = require("../lesson/task.table");
const TaskListTable = require("../lesson/taskList.table");

module.exports = (DataTypes) => ['taskListTasks', {
    taskListTaskId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    taskId: {
        type: DataTypes.UUID,
        references: {
            model: TaskTable(DataTypes)[0],
            key: 'taskId',
        }
    },
    taskListId: {
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: TaskListTable(DataTypes)[0],
            key: 'taskListId',
        }
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
}];
