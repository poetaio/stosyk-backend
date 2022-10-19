module.exports = (sequelize, DataTypes) => sequelize.define('teacher', {
    teacherId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    walletId: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    defaultCardToken:{
        type: DataTypes.STRING,
        defaultValue: "",
    },
    lastPaymentDate: {
        type: DataTypes.DATE,
        defaultValue: "",
    },
});
