module.exports = (lessonId) => ({
    association: 'studentLessons',
    where: { lessonId },
    required: true
});
