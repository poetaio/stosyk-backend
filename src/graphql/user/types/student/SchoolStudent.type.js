const {GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInt, GraphQLList} = require("graphql");
const {lessonController, courseController} = require("../../../../controllers");
const StudentLessonResultType = require("./StudentLessonResult.type");
const StudentCourseResultsType = require("../../../lesson/types/course/StudentCourseResults.type");

module.exports = new GraphQLObjectType({
    name: "SchoolStudentType",
    description: "Student with results",
    fields: () => ({
        studentId: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        courseResults: {
            type: new GraphQLList(new GraphQLNonNull(StudentCourseResultsType)),
            resolve: async (parent, args, context) => {
                // setting studentId, for it to available in StudentCourseResultsType parent object in resolvers for its fields, duh
                const courseModels = await courseController.getCoursesBySchoolId(parent)
                return courseModels.map(courseModel => {
                    const course = courseModel.get({plain: true});
                    course.studentId = parent.studentId;
                    return course;
                })
            }
        },
        lessonResults: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(StudentLessonResultType))),
            resolve: async (parent, args, context) => {
                const lessonModels = await lessonController.getLessonsBySchoolId(parent)
                return lessonModels.map(
                    lessonModel => {
                        const lesson = lessonModel.get({plain: true});
                        lesson.studentId = parent.studentId;
                        return lesson;
                    }
                )
            }
        },
    }),
});
