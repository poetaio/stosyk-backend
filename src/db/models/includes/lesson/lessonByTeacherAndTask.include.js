module.exports = (teacherId, taskId) => [
    {
        association: 'lessonTaskList',
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
        association: 'lessonLessonTeacher',
        where: {
            teacherId
        },
        required: true
    }
];
