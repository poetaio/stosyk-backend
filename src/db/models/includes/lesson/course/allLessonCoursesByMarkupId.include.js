// used on LessonCourse model
module.exports = (lessonMarkupId) => ({
    association: 'lesson',
    required: true,
    attributes: [],
    where: {lessonMarkupId},
});
