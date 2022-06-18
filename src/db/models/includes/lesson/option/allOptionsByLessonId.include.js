module.exports = (lessonId) => ({
    association: "gap",
    attributes: [],
    include: {
        association: "sentence",
        attributes: [],
        include: {
            association: "task",
            attributes: ['type'],
            include: {
                association: 'taskList',
                where: { lessonId },
                required: true,
            },
            required: true,
        },
        required: true,
    },
    required: true,
});
