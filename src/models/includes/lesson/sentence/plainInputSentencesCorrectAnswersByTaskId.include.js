const sequelize = require("../../../sequelize");

module.exports = (taskId) => [{
    association: 'sentenceSentenceGaps',
    separate: true,
    include: {
        association: 'sentenceGapGap',
        include: {
            separate: true,
            association: 'gapGapOptions',
            include: {
                association: 'gapOptionOption',
                // where: Sequelize.literal(`isCorrect = true AND ${OPTION_NO_STUDENT_HAVE_CHOSEN_WHERE}`)
                where: {
                    isCorrect: true,
                    // if null then no students chosen option
                    // '$optionStudents.studentId$': null,
                    // '$gapOptionOption->optionStudents->studentOption.studentId$': null,
                },
                required: true,
                include: {
                    association: "optionStudents",
                    // model: sequelize.models.StudentOption,
                    // left outer join
                    required: false,
                    left: true,
                    // where: {
                    //     studentId: null
                    // }
                }
            },
        }
    }
}, {
    association: "sentenceTaskSentence",
    where: { taskId },
    required: true
}];
