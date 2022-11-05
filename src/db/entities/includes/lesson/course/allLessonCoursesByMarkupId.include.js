// used on LessonCourse model
module.exports = (lessonMarkupId) => ({
    association: 'lessonCourses',
    required: true,
    attributes: [],
    where: {lessonMarkupId},
});
