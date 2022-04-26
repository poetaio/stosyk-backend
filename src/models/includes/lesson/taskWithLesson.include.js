module.exports = {
    association: 'taskTaskListTask',
    include: {
        association: 'taskListTaskTaskList',
        include: {
            association: 'taskListLesson',
            required: true
        },
        required: true
    }
};
