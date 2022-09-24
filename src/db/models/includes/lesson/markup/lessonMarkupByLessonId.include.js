module.exports = (lessonId) => ({
    association: 'lessons',
    required: true,
    attributes: [],
    where: {lessonId},
});
