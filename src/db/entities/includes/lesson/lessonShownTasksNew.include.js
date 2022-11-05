module.exports = {
    association: 'taskList',
    include: {
        association: 'tasks',
        where: { answersShown: true },
        required: true,
    }
};
