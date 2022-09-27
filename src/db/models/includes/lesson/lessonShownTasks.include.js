module.exports = {
    association: 'taskList',
    include: {
        separate: true,
        association: 'taskListTaskListTasks',
        include: {
            association: 'taskListTaskTask',
            where: { answersShown: true },
            required: true
        }
    }
};
