module.exports = (lessonId, types) => ({
    association: 'sentence',
    attributes: [],
    required: true,
    include: {
        association: 'task',
        attributes: [],
        where: { type: types },
        required: true,
        include: {
            association: 'taskList',
            attributes: [],
            required: true,
            where: {lessonId},
        }
    }
});
