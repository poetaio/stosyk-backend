'use strict';

module.exports = {
  async up (queryInterface, DataTypes) {

    const {CourseTable, TeacherCourseTable, LessonCourseTable} = require('../migrations-schemas')(DataTypes);

    return queryInterface.sequelize.transaction((t) =>
        queryInterface.createTable(...CourseTable, { transaction: t })
            .then(() => queryInterface.createTable(...TeacherCourseTable, { transaction: t }))
            .then(() => queryInterface.createTable(...LessonCourseTable, { transaction: t })))
  },

  async down (queryInterface, DataTypes) {

    const {CourseTable, TeacherCourseTable, LessonCourseTable} = require('../migrations-schemas')(DataTypes);

    return queryInterface.sequelize.transaction((t) =>
        queryInterface.dropTable(TeacherCourseTable[0], {
          transaction: t,
          cascade: true,
        })
            .then(() => queryInterface.dropTable(LessonCourseTable[0], {
              transaction: t,
              cascade: true
            }))
            .then(() => queryInterface.dropTable(CourseTable[0], {
              transaction: t,
              cascade: true
            })))
  }
};
