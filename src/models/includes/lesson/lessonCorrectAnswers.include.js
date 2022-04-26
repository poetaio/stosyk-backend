module.exports = {
    association: 'lessonTaskList',
    include: {
        separate: true,
        association: 'taskListTaskListTasks',
        include: {
            association: 'taskListTaskTask',
            where: { answersShown: true },
            required: true,
            include: {
                separate: true,
                association: 'taskTaskSentences',
                include: {
                    association: 'taskSentenceSentence',
                    include: {
                        separate: true,
                        association: 'sentenceSentenceGaps',
                        include: {
                            association: 'sentenceGapGap',
                            include: {
                                separate: true,
                                association: 'gapGapOptions',
                                include: {
                                    association: 'gapOptionOption',
                                    where: { isCorrect: true }
                                },
                            }
                        }
                    }
                }
            }
        }
    }
};
