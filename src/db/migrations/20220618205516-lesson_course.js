'use strict';

module.exports = {
  async up (queryInterface, DataTypes) {

    const {CourseTable, TeacherCourseTable, LessonCourseTable} = require('../schema')(DataTypes);

    return queryInterface.sequelize.transaction((t) =>
        queryInterface.createTable(...CourseTable, { transaction: t })
            .then(() => queryInterface.createTable(...TeacherCourseTable, { transaction: t }))
            .then(() => queryInterface.createTable(...LessonCourseTable, { transaction: t })))
  },

  async down (queryInterface, DataTypes) {

    const {CourseTable, TeacherCourseTable, LessonCourseTable} = require('../schema')(DataTypes);

    return queryInterface.sequelize.transaction((t) =>
        queryInterface.dropTable(TeacherCourseTable[0], { transaction: t })
            .then(() => queryInterface.dropTable(LessonCourseTable[0], { transaction: t }))
            .then(() => queryInterface.dropTable(CourseTable[0], { transaction: t })))
  }
};
