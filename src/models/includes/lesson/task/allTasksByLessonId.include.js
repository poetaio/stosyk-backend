module.exports = (lessonId) => ({
    association: "taskList",
    required: true,
    include: {
        association: "taskListLesson",
        where: { lessonId },
        required: true,
    }
});
