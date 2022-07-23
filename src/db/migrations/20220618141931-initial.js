module.exports = {
    async up(queryInterface, DataTypes) {
        const {
            LessonTable,
            TaskListTable,
            TaskTable,
            SentenceTable,
            GapTable,
            OptionTable,
            AccountTable,
            UserTable,
            TeacherTable,
            StudentTable,
            LessonStudentTable,
            LessonTeacherTable,
            TaskListTaskTable,
            TaskSentenceTable,
            SentenceGapTable,
            GapOptionTable,
            StudentOptionTable,
            TaskAttachmentsTable,
        } = require('../schema')(DataTypes);

        return queryInterface.sequelize.transaction((t) =>
            queryInterface.createTable(...LessonTable, { transaction: t })
                .then(() => queryInterface.createTable(...TaskListTable, { transaction: t }))
                .then(() => queryInterface.createTable(...TaskTable, { transaction: t }))
                .then(() => queryInterface.createTable(...SentenceTable, { transaction: t }))
                .then(() => queryInterface.createTable(...GapTable, { transaction: t }))
                .then(() => queryInterface.createTable(...OptionTable, { transaction: t }))
                .then(() => queryInterface.createTable(...UserTable, { transaction: t }))
                .then(() => queryInterface.createTable(...AccountTable, { transaction: t }))
                .then(() => queryInterface.createTable(...TeacherTable, { transaction: t }))
                .then(() => queryInterface.createTable(...StudentTable, { transaction: t }))
                .then(() => queryInterface.createTable(...LessonStudentTable, { transaction: t }))
                .then(() => queryInterface.createTable(...LessonTeacherTable, { transaction: t }))
                .then(() => queryInterface.createTable(...TaskListTaskTable, { transaction: t }))
                .then(() => queryInterface.createTable(...TaskSentenceTable, { transaction: t }))
                .then(() => queryInterface.createTable(...SentenceGapTable, { transaction: t }))
                .then(() => queryInterface.createTable(...GapOptionTable, { transaction: t }))
                .then(() => queryInterface.createTable(...StudentOptionTable, { transaction: t }))
                .then(() => queryInterface.createTable(...TaskAttachmentsTable, { transaction: t }))
        );
    },

    async down (queryInterface, DataTypes) {
        const {
            LessonTable,
            TaskListTable,
            TaskTable,
            SentenceTable,
            GapTable,
            OptionTable,
            AccountTable,
            UserTable,
            TeacherTable,
            StudentTable,
            LessonStudentTable,
            LessonTeacherTable,
            TaskListTaskTable,
            TaskSentenceTable,
            SentenceGapTable,
            GapOptionTable,
            StudentOptionTable,
            TaskAttachmentsTable,
        } = require('../schema')(DataTypes);

        return queryInterface.sequelize.transaction((t) =>
            queryInterface.dropTable(LessonStudentTable[0], { transaction: t })
                .then(() => queryInterface.dropTable(LessonTeacherTable[0], { transaction: t }))
                .then(() => queryInterface.dropTable(TaskListTaskTable[0], { transaction: t }))
                .then(() => queryInterface.dropTable(TaskSentenceTable[0], { transaction: t }))
                .then(() => queryInterface.dropTable(SentenceGapTable[0], { transaction: t }))
                .then(() => queryInterface.dropTable(GapOptionTable[0], { transaction: t }))
                .then(() => queryInterface.dropTable(StudentOptionTable[0], { transaction: t }))
                .then(() => queryInterface.dropTable(TaskAttachmentsTable[0], { transaction: t }))
                .then(() => queryInterface.dropTable(TaskListTable[0], { transaction: t }))
                .then(() => queryInterface.dropTable(LessonTable[0], { transaction: t }))
                .then(() => queryInterface.dropTable(TaskTable[0], { transaction: t }))
                .then(() => queryInterface.dropTable(SentenceTable[0], { transaction: t }))
                .then(() => queryInterface.dropTable(GapTable[0], { transaction: t }))
                .then(() => queryInterface.dropTable(OptionTable[0], { transaction: t }))
                .then(() => queryInterface.dropTable(AccountTable[0], { transaction: t }))
                .then(() => queryInterface.dropTable(TeacherTable[0], { transaction: t }))
                .then(() => queryInterface.dropTable(StudentTable[0], { transaction: t }))
                .then(() => queryInterface.dropTable(UserTable[0], { transaction: t }))
        );
    }
};
