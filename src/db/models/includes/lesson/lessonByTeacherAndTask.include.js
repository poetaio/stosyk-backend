module.exports = (teacherId, taskId) => [
    {
        association: 'taskList',
        include: {
            association: 'taskListTaskListTasks',
            include: {
                association: 'taskListTaskTask',
                where: { taskId },
                required: true
            }
        }
    },
    {
        association: 'lessonMarkup',
        attributes: [],
        required: true,
        include: {
            association: 'lessonLessonTeacher',
            attributes: [],
            required: true,
            where: {
                teacherId
            },
        },
    }
];
