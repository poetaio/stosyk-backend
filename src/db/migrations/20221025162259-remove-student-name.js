"use strict";

const UPDATE_USER_NAME_TO_STUDENT_NAME = `
    UPDATE students s
    SET name = (
        SELECT name
        FROM users u
        where u."userId" = s."userId"
    )
`;

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction((t) =>
            queryInterface.removeColumn(
                "students",
                "name",
                { transaction: t },
            ),
        );
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction((transaction) =>
            queryInterface.addColumn(
                "students",
                "name",
                {
                    type: Sequelize.STRING(500),
                },
                { transaction },
            )
                .then(() => queryInterface.sequelize.query(UPDATE_USER_NAME_TO_STUDENT_NAME, { transaction }))
                .then(() => queryInterface.changeColumn(
                    "students",
                    "name",
                    {
                        type: Sequelize.STRING(500),
                        allowNull: false,
                    },
                    { transaction },
                )),
        );
    },
};
