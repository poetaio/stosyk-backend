module.exports = {
    association: 'taskList',
    include: {
        association: 'task',
        where: { answersShown: true },
        required: true,
    }
};
