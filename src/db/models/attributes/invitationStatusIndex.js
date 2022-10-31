const {literal} = require("sequelize");

const sortStatus = `
    CASE
        WHEN "status" = 'PENDING' THEN 0
        WHEN "status" = 'ACCEPTED' THEN 1
        WHEN "status" = 'DECLINED' THEN 2
        WHEN "status" = 'WITHDRAWN' THEN 3
    END
`;

module.exports = [
    literal(sortStatus),
    'statusIndex'
]