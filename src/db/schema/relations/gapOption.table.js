const GapTable = require("../lesson/gap.table");
const OptionTable = require("../lesson/option.table");

module.exports = (DataTypes) => ['gapOptions', {
    gapOptionId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    gapId: {
        type: DataTypes.UUID,
        references: {
            model: GapTable(DataTypes)[0],
            key: 'gapId',
        }
    },
    optionId: {
        type: DataTypes.UUID,
        references: {
            model: OptionTable(DataTypes)[0],
            key: 'optionId',
        }
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
}];
