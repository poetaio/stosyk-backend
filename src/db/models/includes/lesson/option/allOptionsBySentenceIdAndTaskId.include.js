module.exports = (sentenceId, taskId) => ({
    association: "gap",
    attributes: [],
    include: {
        association: "sentence",
        where: { sentenceId },
        attributes: [],
        include: {
            association: "task",
            attributes: [],
            where: { taskId },
            required: true,
        },
        required: true,
    },
    required: true,
});
