/**
 * Migration summary:
 * 1. Remove columns inviteEmail and Status from SchoolStudentSeat
 * 2. Create SchoolInvitations table
 *
 * WARNING:
 * All current invites are removed
 */

const {SchoolStudentSeatStatusEnum} = require("../../utils");
module.exports = {
    async up(queryInterface, Sequelize) {
        const {SchoolInvitation} = require('../schema/20221013101226-school-invitation')(Sequelize);

        return queryInterface.sequelize.transaction((transaction) =>
            queryInterface.createTable(...SchoolInvitation, { transaction })
                .then(() => queryInterface.removeColumn('schoolStudentSeats','status', { transaction }))
                .then(() => queryInterface.removeColumn('schoolStudentSeats','inviteEmail', { transaction }))
                .then(() => queryInterface.sequelize.query('drop type "enum_schoolStudentSeats_status";', {transaction}))
        );
    },

    async down(queryInterface, Sequelize) {
        const {SchoolInvitation} = require('../schema/20221013101226-school-invitation')(Sequelize);

        return queryInterface.sequelize.transaction((transaction) =>
            queryInterface.dropTable(SchoolInvitation[0], { transaction })
                .then(() => queryInterface.addColumn(
                    'schoolStudentSeats',
                    'status',
                    {
                        type: Sequelize.ENUM(...Object.values(SchoolStudentSeatStatusEnum)),
                        allowNull: false,
                        defaultValue: SchoolStudentSeatStatusEnum.FREE,
                    },
                    { transaction }))
                .then(() => queryInterface.addColumn(
                    'schoolStudentSeats',
                    'inviteEmail',
                    {
                        type: Sequelize.STRING,
                    },
                    { transaction })
                ),
            );
    }
};
