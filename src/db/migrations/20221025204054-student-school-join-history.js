/**
 * Migration summary:
 * 1. Renaming table schoolStudentSeats to studentSchools
 * 2. Adding dropout date to studentSchools
 * 3. Renaming schoolStudentSeatId to schoolStudentId
 * 4. Renaming studentsSeatsCount to totalSeatsCount in schools
 */

const renameSchoolStudentSeatsQuery = `
    ALTER TABLE "schoolStudentSeats"
    RENAME TO "schoolStudents"
`;
const renameSchoolStudentsQuery = `
    ALTER TABLE "schoolStudents"
    RENAME TO "schoolStudentSeats"
`;
const removeSchoolStudentSeatIdPKConstraintQuery = `
    ALTER TABLE "schoolStudents" 
    DROP CONSTRAINT "schoolStudentSeats_pkey";
`;
const renameSchoolStudentSeatIdQuery = `
    ALTER TABLE "schoolStudents" 
    RENAME COLUMN "schoolStudentSeatId" TO "schoolStudentId";
`;
const addSchoolStudentIdPKConstraintQuery = `
    ALTER TABLE "schoolStudents"
    ADD PRIMARY KEY ("schoolStudentId");
`;
const removeSchoolStudentIdPKConstraintQuery = `
    ALTER TABLE "schoolStudentSeats" 
    DROP CONSTRAINT "schoolStudents_pkey";
`;
const renameSchoolStudentIdQuery = `
    ALTER TABLE "schoolStudentSeats" 
    RENAME COLUMN "schoolStudentId" TO "schoolStudentSeatId";
`;
const addSchoolStudentSeatIdPKConstraintQuery = `
    ALTER TABLE "schoolStudentSeats"
    ADD PRIMARY KEY ("schoolStudentSeatId");
`;
const renameStudentsSeatsCountQuery = `
    ALTER TABLE schools 
    RENAME COLUMN "studentsSeatsCount" TO "totalSeatsCount";
`;
const renameStudentsCountQuery = `
    ALTER TABLE schools 
    RENAME COLUMN "totalSeatsCount" TO "studentsSeatsCount";
`;

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction((transaction) =>
            queryInterface.sequelize.query(
                renameSchoolStudentSeatsQuery,
                {transaction},
            )
                .then(() => queryInterface.addColumn(
                    'schoolStudents',
                    'droppedOutAt',
                    {
                        type: Sequelize.DATE,
                    },
                    {transaction})
                )
                .then(() => queryInterface.sequelize.query(
                    removeSchoolStudentSeatIdPKConstraintQuery,
                    {transaction}
                ))
                .then(() => queryInterface.sequelize.query(
                    renameSchoolStudentSeatIdQuery,
                    {transaction}
                ))
                .then(() => queryInterface.sequelize.query(
                    addSchoolStudentIdPKConstraintQuery,
                    {transaction}
                ))
                .then(() => queryInterface.sequelize.query(
                    renameStudentsSeatsCountQuery,
                    {transaction}
                ))
        );
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.sequelize.transaction((transaction) =>
            queryInterface.removeColumn(
                    'schoolStudents',
                    'droppedOutAt',
                    {transaction}
                )
                .then(() => queryInterface.sequelize.query(
                    renameSchoolStudentsQuery,
                    {transaction},
                )).then(() => queryInterface.sequelize.query(
                    removeSchoolStudentIdPKConstraintQuery,
                    {transaction}
                ))
                .then(() => queryInterface.sequelize.query(
                    renameSchoolStudentIdQuery,
                    {transaction}
                ))
                .then(() => queryInterface.sequelize.query(
                    addSchoolStudentSeatIdPKConstraintQuery,
                    {transaction}
                ))
                .then(() => queryInterface.sequelize.query(
                    renameStudentsCountQuery,
                    {transaction}
                ))
        );
    }
};
