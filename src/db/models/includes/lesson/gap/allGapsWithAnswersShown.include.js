module.exports = {
    association: 'sentence',
    attributes: [],
    required: true,
    include: {
        association: 'task',
        attributes: [],
        required: true,
        where: {answersShown: true},
    },
};
