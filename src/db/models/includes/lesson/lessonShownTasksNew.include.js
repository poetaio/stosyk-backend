module.exports = {
    association: 'lessonTaskList',
    include: {
        association: 'tasks',
        where: { answersShown: true },
        required: true,
    }
};
