module.exports = (lessonId) => ({
    association: "taskList",
    required: true,
    include: {
        association: "lesson",
        where: { lessonId },
        required: true,
    }
});
