module.exports = (lessonId) => ({
    include: {
        association: 'gap',
        include: {
            association: 'sentence',
            include: {
                association: 'task',
                include: {
                    association: 'taskList',
                    where: { lessonId },
                },
            },
        },
    },
});
