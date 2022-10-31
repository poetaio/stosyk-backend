const {literal} = require("sequelize");

// todo: change when there is dropout history for student
const schoolStudentStatus = `
    CASE
        WHEN seats."studentId" IS NOT NULL THEN 'ON_BOARD'
        ELSE 'DROPPED_OUT'
    END
`;

module.exports = [
    literal(schoolStudentStatus),
    'status'
];
