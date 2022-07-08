module.exports = (taskId) => ({
    association: "optionGapOption",
    include: {
        association: "gapOptionGap",
        include: {
            association: "gapSentenceGap",
            include: {
                association: "sentenceGapSentence",
                include: {
                    association: "sentenceTaskSentence",
                    include: {
                        association: "taskSentenceTask",
                        where: { taskId },
                        required: true,
                    },
                    required: true,
                },
                required: true,
            },
            required: true,
        },
        required: true,
    },
    required: true,
});
