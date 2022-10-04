// used on LessonCourse model
module.exports = (lessonId) => ({
    association: 'lesson',
    required: true,
    attributes: [],
    include: {
        association: 'lessons',
        required: true,
        attributes: [],
        where: {lessonId},
    }
});
