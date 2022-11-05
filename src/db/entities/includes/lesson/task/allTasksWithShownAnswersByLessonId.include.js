module.exports = (lessonId) => ({
    association: "taskList",
    where: {answersShown: true},
    required: true,
    include: {
        association: "lesson",
        where: { lessonId },
        required: true,
    }
});
