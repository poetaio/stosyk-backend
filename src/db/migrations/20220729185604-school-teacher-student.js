const {v4} = require("uuid");

const COPY_LESSONS_FROM_TEACHER_TO_SCHOOL_QUERY = `
    UPDATE lessons
    SET "schoolId" = st."schoolId"
    FROM "lessonTeachers" lt
             INNER JOIN
         teachers t on lt."teacherId" = t."teacherId"
             INNER JOIN
         "schoolTeachers" st on lt."teacherId" = t."teacherId"
    WHERE lessons."lessonId" = lt."lessonId"
`;

const COPY_COURSES_FROM_TEACHER_TO_SCHOOL_QUERY = `
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
        const {SchoolTeacherTable, SchoolStudentSeatTable} = require('../schema/relations')(Sequelize);


        return queryInterface.sequelize.transaction((transaction) =>
            queryInterface.createTable(...SchoolTeacherTable, {transaction})
                .then(() => queryInterface.sequelize.query(`SELECT "teacherId"
                                                            FROM teachers`, {transaction}))
                // creating school for each teacher & relating them
                .then((teacherIds) => Promise.all(
                    teacherIds[0].map(({teacherId}) => {
                            const schoolId = v4();

                            return queryInterface.sequelize.query(`INSERT INTO schools("schoolId", name, "createdAt", "updatedAt")
                                                                   VALUES ('${schoolId}', 'default name', NOW(), NOW())
                                                                   RETURNING 'schoolId'`,
                                {transaction}
                            )
                                .then(() => schoolId)
                                .then((schoolId) =>
                                    queryInterface.sequelize.query(`INSERT INTO "schoolTeachers"("schoolTeacherId", "schoolId", "teacherId", "accessRight", "createdAt", "updatedAt")
                                                                    VALUES ('${v4()}', '${schoolId}', '${teacherId}', 'ADMIN', NOW(), NOW())`,
                                        {transaction}))
                        }
                    )
                ))
                // copying all teacher's lessons & courses to student_seat
                .then(() => queryInterface.sequelize.query(COPY_LESSONS_FROM_TEACHER_TO_SCHOOL_QUERY, {transaction}))
                .then(() => queryInterface.sequelize.query(COPY_COURSES_FROM_TEACHER_TO_SCHOOL_QUERY, {transaction}))
                .then(() => queryInterface.createTable(...SchoolStudentSeatTable, {transaction}))
        );
    },

    async down(queryInterface, Sequelize) {
        const {SchoolTeacherTable, SchoolStudentSeatTable} = require('../schema/relations')(Sequelize);

        return queryInterface.sequelize.transaction((transaction) =>
            queryInterface.dropTable(SchoolTeacherTable[0], {transaction})
                .then(() => queryInterface.dropTable(SchoolStudentSeatTable[0], {transaction}))
        );
    }
};
