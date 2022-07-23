const GapTable = require("../lesson/gap.table");
const SentenceTable = require("../lesson/sentence.table");

module.exports = (DataTypes) => ['sentenceGaps', {
    sentenceGapId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
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
    gapId: {
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        references: {
            model: GapTable(DataTypes)[0],
            key: 'gapId',
        }
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
}];
