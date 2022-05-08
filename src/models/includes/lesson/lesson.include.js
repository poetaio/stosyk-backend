module.exports = {
    association: 'lessonTaskList',
    include: {
        separate: true,
        association: 'taskListTaskListTasks',
        include: {
            association: 'taskListTaskTask',
            include: [{
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
                                include: 'gapOptionOption'
                            }
                        }
                    }
                }
            }, "taskAttachments" ]
        }
    }
};
