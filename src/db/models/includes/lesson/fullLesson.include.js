module.exports = {
    association: 'lessonTaskList',
    include: {
        association: 'tasks',
        include: [{
            association: 'sentences',
            include: {
                association: 'gaps',
                include: {
                    association: 'options',
                }
            }
        }, "attachments"]
    }
}