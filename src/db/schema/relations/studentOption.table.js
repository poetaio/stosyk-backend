const StudentTable = require("../user/student.table");
const OptionTable = require("../lesson/option.table");
const SentenceTable = require("../lesson/sentence.table");

module.exports = (DataTypes) => ['studentOptions', {
    studentOptionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    studentId: {
        type: DataTypes.UUID,
        references: {
            model: StudentTable(DataTypes)[0],
            key: 'studentId',
        }
    },
    optionId: {
        type: DataTypes.UUID,
        references: {
            model: OptionTable(DataTypes)[0],
            key: 'optionId',
        }
    },
    sentenceId: {
        type: DataTypes.UUID,
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
