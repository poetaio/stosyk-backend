const LessonMarkup = require("./lessonMarkup.table");
const LessonCourse = require("./LessonCourse.table");

module.exports = (DataTypes) => ({
    LessonMarkupTable: LessonMarkup(DataTypes),
    LessonCourseTable: LessonCourse(DataTypes),
});
