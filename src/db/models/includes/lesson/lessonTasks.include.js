module.exports = {
    association: 'taskList',
    include: {
        separate: true,
        association: 'taskListTaskListTasks',
        include: {
            association: 'taskListTaskTask',
        }
    }
};
