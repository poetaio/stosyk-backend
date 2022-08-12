const fullLesson = {
    association: 'taskList',
    required: true,
    include: {
        association: 'tasks',
        include: {
            association: 'sentences',
            include: {
                association: 'gaps',
                include: {
                    association: 'options',
                }
            }
        }
    }
}

module.exports = [
    fullLesson,
    // {
    //     association: 'homeworks',
    //     include: fullLesson,
    // }
];
