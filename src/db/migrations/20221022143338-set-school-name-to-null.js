/**
 * Migration summary:
 * 1. Set default name in school name to null
 *    It's needed in order to send invitation email from either school's name or teacher's name
 */

const updateNameToNullQuery = `
    UPDATE schools 
    SET name = NULL 
    WHERE name = 'default name'
`;
const updateNameToDefaultQuery = `
    UPDATE schools 
    SET name = 'default name' 
    WHERE name IS NULL
`;

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction((transaction) =>
            queryInterface.changeColumn(
                    'schools',
                    'name',
                    {
                        type: Sequelize.STRING,
                        allowNull: true,
                        unique: false,
                        defaultValue: null,
                    },
                    { transaction }
                )
                .then(() => queryInterface.sequelize.query(updateNameToNullQuery, {transaction}))
        );
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction((transaction) =>
            queryInterface.sequelize.query(updateNameToDefaultQuery, {transaction})
                .then(() => queryInterface.changeColumn(
                'schools',
                'name',
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                    unique: false,
                    defaultValue: "default name",
                },
                { transaction }
            ))
        );
    }
};
