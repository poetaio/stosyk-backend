const {GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID, GraphQLInt, GraphQLList} = require("graphql");
const SchoolStudentSeatStatusEnumType = require("../../../school/types/student_seat/SchoolStudentSeatStatusEnum.type");
const {lessonController, courseController} = require("../../../../controllers");
const {schoolController} = require("../../../../controllers/school");
const StudentLessonResultType = require("./StudentLessonResult.type");
const TeacherCourseType = require("../../../lesson/types/course/TeacherCourse.type");
const StudentCourseResultsType = require("../../../lesson/types/course/StudentCourseResults.type");

module.exports = new GraphQLObjectType({
    name: "SchoolStudentType",
    description: "Student with results",
    fields: () => ({
        studentId: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        courseResults: {
            type: GraphQLList(GraphQLNonNull(StudentCourseResultsType)),
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
            type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentLessonResultType))),
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
