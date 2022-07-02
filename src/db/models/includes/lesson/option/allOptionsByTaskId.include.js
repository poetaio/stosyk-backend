module.exports = (taskId) => ({
    association: "gap",
    attributes: [],
    include: {
        association: "sentence",
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
