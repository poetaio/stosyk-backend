module.exports = {
    association: 'gaps',
    include: {
        association: 'options',
        where: { isCorrect: true },
    },
    required: true,
};
