const TaskTable = require("../lesson/task.table");
const SentenceTable = require("../lesson/sentence.table");

module.exports = (DataTypes) => ['taskSentences', {
    taskSentenceId: {
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
    sentenceId: {
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: SentenceTable(DataTypes)[0],
            key: 'sentenceId',
        }
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
}];
