'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const {SubpackageTable} = require("../schema/user")(Sequelize);
    return queryInterface.sequelize.transaction((t) =>
        // add nullish column
        queryInterface.addColumn(
            'teachers',
            'packageId',
            {
              type: Sequelize.UUID,
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
              references: {
                model: SubpackageTable[0],
                key: 'packageId',
              },
            }, {
              transaction: t
            }
        )
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
        queryInterface.removeColumn(
            'teachers',
            'subpackageId',
            { transaction: t },
        )
    );
  }
};
