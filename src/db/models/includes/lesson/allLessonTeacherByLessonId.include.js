module.exports = (lessonId) => ({
    association: 'lesson',
    required: true,
    attributes: [],
    where: {lessonId},
});
