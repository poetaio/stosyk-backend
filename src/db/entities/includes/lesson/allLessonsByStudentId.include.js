module.exports = (studentId) => ({
    association: 'taskList',
    required: true,
    attributes: [],
    include: {
        association: 'taskListTaskListTasks',
        required: true,
        attributes: [],
        separate: true,
        include: {
            association: 'taskListTaskTask',
            required: true,
            attributes: [],
            include: {
                association: 'sentences',
                required: true,
                attributes: [],
                include: {
                    association: 'gaps',
                    required: true,
                    attributes: [],
                    include: {
                        association: 'options',
                        required: true,
                        attributes: [],
                        include: {
                            association: 'students',
                            required: true,
                            attributes: [],
                            where: {studentId},
                        }
                    }
                }
            }
        }
    }
});
