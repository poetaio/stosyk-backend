/**
 * Migration summary:
 * 1. Make school name not unique
 *    1.1 Remove old constraint
 *    1.2 Change column
 */

module.exports = {
    async up(queryInterface, Sequelize) {
      return queryInterface.sequelize.transaction((t) =>
          queryInterface.removeConstraint("schools", "schools_name_key")
              .then(() => queryInterface.changeColumn(
                      'schools',
                      'name',
                      {
                        type: Sequelize.STRING,
                        allowNull: false,
                        unique: false,
                        defaultValue: "default name",
                      },
                      { transaction: t }
              )
          )
      );
    },

    async down(queryInterface, Sequelize) {
      return queryInterface.sequelize.transaction((t) =>
          queryInterface.changeColumn(
              'schools',
              'name',
              {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
              },
              { transaction: t }
          )
      );
    }
};
