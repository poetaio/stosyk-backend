module.exports = (sequelize, DataTypes) => sequelize.define('subpackage', {
    packageId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    months: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    seats: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    priceUAH: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
    },
    priceUSD: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
    }
});
