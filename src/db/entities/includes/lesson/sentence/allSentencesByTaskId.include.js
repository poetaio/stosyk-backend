module.exports = (taskId) => ({
    association: 'task',
    where: { taskId },
    attributes: [],
    required: true,
});
