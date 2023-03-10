module.exports = (homeworkId, types) => ({
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
            include: {
                association: 'homework',
                attributes: [],
                required: true,
                where: {homeworkId}
            }
        }
    }
});
