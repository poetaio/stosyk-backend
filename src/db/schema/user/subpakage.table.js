module.exports = (DataTypes) => ['subpackages', {
    packageId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    months: {
        type: DataTypes.INTEGER,
    },
    seats: {
        type: DataTypes.INTEGER,
    },
    priceUAH: {
        type: DataTypes.FLOAT,
    },
    priceUSD: {
        type: DataTypes.FLOAT,
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
}];
