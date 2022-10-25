const {literal} = require("sequelize");

// todo: change when there is dropout history for student
const schoolStudentStatus = `
    CASE
        WHEN "schoolStudents"."droppedOutAt" IS NULL THEN 'ON_BOARD'
        ELSE 'DROPPED_OUT'
    END
`;

module.exports = [
    literal(schoolStudentStatus),
    'status'
];
