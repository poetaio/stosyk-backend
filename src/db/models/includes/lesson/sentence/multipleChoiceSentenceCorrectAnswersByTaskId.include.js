module.exports = (taskId) => [{
    association: 'sentenceSentenceGaps',
    include: {
        association: 'sentenceGapGap',
        include: {
            separate: true,
            association: 'gapGapOptions',
            include: {
                association: 'gapOptionOption',
                where: { isCorrect: true },
                required: true
            },
        }
    }
}, {
    association: "sentenceTaskSentence",
    where: { taskId },
    required: true
}];
