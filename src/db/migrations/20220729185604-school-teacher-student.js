module.exports = {
    async up(queryInterface, Sequelize) {
      const { SchoolTeacherTable, SchoolStudentSeatTable } = require('../schema/relations')(Sequelize);

      return queryInterface.sequelize.transaction((transaction) =>
          queryInterface.createTable(...SchoolTeacherTable, { transaction })
              .then(() => queryInterface.createTable(...SchoolStudentSeatTable, { transaction }))
      );
    },

    async down(queryInterface, Sequelize) {
        const { SchoolTeacherTable, SchoolStudentSeatTable } = require('../schema/relations')(Sequelize);

        return queryInterface.sequelize.transaction((transaction) =>
            queryInterface.dropTable(SchoolTeacherTable[0], { transaction })
                .then(() => queryInterface.dropTable(SchoolStudentSeatTable[0], { transaction }))
        );
    }
};
