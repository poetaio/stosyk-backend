module.exports = {
    association: 'lessonTaskList',
    include: {
        association: 'task',
        where: { answersShown: true },
        required: true,
    }
};
