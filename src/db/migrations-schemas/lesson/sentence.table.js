module.exports = (DataTypes) => ['sentences', {
    sentenceId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    index: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
    },
    text: {
        type: DataTypes.STRING(1500),
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
}];
