module.exports = {
    association: 'taskTaskListTask',
    include: {
        association: 'taskListTaskTaskList',
        include: {
            association: 'lesson',
            required: true
        },
        required: true
    }
};
