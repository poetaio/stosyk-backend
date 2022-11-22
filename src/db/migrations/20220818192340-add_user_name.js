"use strict";

const { logger } = require("../../utils");
const SET_TEACHER_NAME_TO_DEFAULT = `
    UPDATE users
    SET name = 'Викладач'
    WHERE role = 'TEACHER';
`;

const SET_USER_NAME_TO_STUDENT_NAME = `
    UPDATE users u
    SET name = (
        SELECT name
        FROM students s
        WHERE s."userId" = u."userId"
    );
`;

const SET_STUDENT_NAME_TO_USER_NAME = `
    UPDATE students s
    SET name = (
        SELECT u.name
        FROM users u
        WHERE u."userId" = s."userId"
    )
`;

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction((t) =>
            // add nullish column
            queryInterface.addColumn(
                "users",
                "name",
                {
                    type: Sequelize.STRING(500),
                },
                { transaction: t },
            )
                .then(() => logger.info("Added name to table users"))
                // fill with default values
                .then(() => logger.info("Copying student name to users table"))
                .then(() => queryInterface.sequelize.query(SET_USER_NAME_TO_STUDENT_NAME, { transaction: t }))
                .then(() => logger.info("Setting teacher name to default 'Name'"))
                .then(() => queryInterface.sequelize.query(SET_TEACHER_NAME_TO_DEFAULT, { transaction: t }))
                .then(() => logger.info("Changing column name to non-nullish"))
                // change column to non-nullish
                .then(() => queryInterface.changeColumn(
                    "users",
                    "name",
                    {
                        type: Sequelize.STRING(500),
                        allowNull: false,
                        defaultValue: false,
                    },
                    { transaction: t },
                )),
        );
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction((transaction) =>
            new Promise((resolve) => logger.info("Updating student names to user names") && resolve())
                .then(() => queryInterface.sequelize.query(SET_STUDENT_NAME_TO_USER_NAME, { transaction }))
                .then(() => logger.info("Removing column name from users"))
                .then(() => queryInterface.removeColumn(
                    "users",
                    "name",
                    { transaction },
                )),
        );
    },
};
