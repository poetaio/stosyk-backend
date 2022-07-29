const {v4} = require("uuid");

const copyLessonsFromTeacherToSchool = `
    UPDATE lessons 
    SET "schoolId" = st."schoolId"
    FROM "lessonTeachers" lt 
        INNER JOIN
        teachers t on lt."teacherId" = t."teacherId"
        INNER JOIN 
        "schoolTeachers" st on lt."teacherId" = t."teacherId"
    WHERE lessons."lessonId" = lt."lessonId"
`;
const copyCoursesFromTeacherToSchool = `
    UPDATE courses 
    SET "schoolId" = st."schoolId"
    FROM "teacherCourses" tc
        INNER JOIN
        teachers t on tc."teacherId" = t."teacherId"
        INNER JOIN 
        "schoolTeachers" st on tc."teacherId" = t."teacherId"
    WHERE courses."courseId" = tc."courseId"
`;

module.exports = {
    async up(queryInterface, Sequelize) {
      const { SchoolTeacherTable, SchoolStudentSeatTable } = require('../schema/relations')(Sequelize);

      return queryInterface.sequelize.transaction((transaction) =>
          queryInterface.createTable(...SchoolTeacherTable, { transaction })
              .then(() => queryInterface.sequelize.query(`SELECT "teacherId" FROM teachers`, { transaction }))
              // creating school for each teacher & relating them
              .then((teacherIds) => Promise.all(
                  teacherIds[0].map((teacherId) => {
                      const id = v4();
                      return queryInterface.sequelize.query(`INSERT INTO schools("schoolId", name) values('${id}', 'default name')`, { transaction })
                          .then(() =>
                              queryInterface.sequelize.query(`INSERT INTO "schoolTeachers"("schoolId", "teacherId") VALUES ('${id}', '${teacherId}')`, { transaction }))
                  })
              ))
              // copying all teacher's lessons & courses to school
              .then(() => queryInterface.sequelize.query(copyLessonsFromTeacherToSchool, { transaction }))
              .then(() => queryInterface.sequelize.query(copyCoursesFromTeacherToSchool, { transaction }))
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
