module.exports = (homeworkId, types) => ({
    association: 'task',
    where: { type: types },
    attributes: [],
    required: true,
    include: {
        association: 'taskList',
        attributes: [],
        required: true,
        where: { homeworkId }
    }
});
