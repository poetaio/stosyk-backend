module.exports = {
    association: 'lessonTaskList',
    attributes: ['taskListId'],
    include: {
        association: 'tasks',
        attributes: ['taskId'],
        include: [{
            association: 'sentences',
            attributes: ['sentenceId'],
            include: {
                association: 'gaps',
                attributes: ['gapId'],
                include: {
                    association: 'options',
                    attributes: ['optionId'],
                },
            },
        }, "attachments"],
    },
};
