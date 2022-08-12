module.exports = {
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
};
