module.exports = (lessonId, types) => ({
    association: 'task',
    where: { type: types },
    attributes: [],
    required: true,
    include: {
        association: 'taskList',
        attributes: [],
        required: true,
        where: { lessonId }
    }
});
