const {StudentLessonType, TeacherCountedLessonsType, LessonsWhereType} = require("./types");
const { lessonController } = require("../../controllers");
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

const studentGetAnswers = {
    type: GraphQLNonNull(GraphQLList(GraphQLNonNull(AnswerSheetTaskInterfaceType))),
    name: "StudentGetAnswers",
    description: "Student Get Answers",
    args: {
        lessonId: {type: GraphQLNonNull(GraphQLID)},
    },
    resolve: async (parent, args, context) => await lessonController.studentGetAnswers(args, context)
}


module.exports = {
    //TEACHER
    teacherLessons: resolveAuthMiddleware(UserRoleEnum.TEACHER)(teacherLessons),

    //STUDENT
    studentLesson: resolveAuthMiddleware(UserRoleEnum.STUDENT)(studentLesson),
    studentGetAnswers: resolveAuthMiddleware(UserRoleEnum.STUDENT)(studentGetAnswers)

};
