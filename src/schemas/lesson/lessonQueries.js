const {StudentLessonType, TeacherCountedLessonsType, LessonsWhereType, CourseType} = require("./types");
const { lessonController, courseController} = require("../../controllers");
const { GraphQLNonNull, GraphQLID, GraphQLList} = require("graphql");
const { resolveAuthMiddleware} = require('../../middleware');
const { UserRoleEnum } = require("../../utils");
const {AnswerSheetTaskInterfaceType} = require("./types/task/answerSheetTask");


const teacherLessons = {
    type: TeacherCountedLessonsType,
    name: 'teacherLessons',
    description: 'Get lessons with total number for teacher',
    args: {
        where: { type: LessonsWhereType }
    },
    resolve: async (parent, args, context) => await lessonController.getTeacherLessons(args, context)
};

const studentLesson = {
    type: StudentLessonType,
    name: 'studentLesson',
    description: 'Get lesson for student',
    args: {
        lessonId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await lessonController.getStudentLesson(args, context)
};

// const studentGetAnswers = {
//     type: GraphQLNonNull(GraphQLList(GraphQLNonNull(AnswerSheetTaskInterfaceType))),
//     name: "StudentGetAnswers",
//     description: "Student Get Answers",
//     args: {
//         lessonId: {type: GraphQLNonNull(GraphQLID)},
//     },
//     resolve: async (parent, args, context) => await lessonController.studentGetAnswers(args, context)
// }

const getAllCourses = {
    type: GraphQLNonNull(GraphQLList(GraphQLNonNull(CourseType))),
    name: 'getAllCourses',
    description: 'Get All Courses',
    resolve: async (parent, args, context) => await courseController.getAllCourses(context)
}


module.exports = {
    //TEACHER
    teacherLessons: resolveAuthMiddleware(UserRoleEnum.TEACHER)(teacherLessons),
    getAllCourses: resolveAuthMiddleware(UserRoleEnum.TEACHER)(getAllCourses),

    //STUDENT
    studentLesson: resolveAuthMiddleware(UserRoleEnum.STUDENT)(studentLesson),
    // studentGetAnswers: resolveAuthMiddleware(UserRoleEnum.STUDENT)(studentGetAnswers)

};
