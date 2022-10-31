const {literal} = require("sequelize");

const seatStatus = `
    CASE
        WHEN "studentId" IS NULL THEN 'FREE'
        ELSE 'OCCUPIED'
    END
`;

module.exports = [
    literal(seatStatus),
    'status'
];
