const {StudentLessonType, TeacherCountedLessonsType,
    LessonsWhereType
} = require("./types");
const { lessonController } = require("../../controllers");
const { GraphQLNonNull, GraphQLID } = require("graphql");
const { resolveAuthMiddleware} = require('../../middleware');
const { UserRoleEnum } = require("../../utils");


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


module.exports = {
    teacherLessons: resolveAuthMiddleware(UserRoleEnum.TEACHER)(teacherLessons),
    studentLesson: resolveAuthMiddleware(UserRoleEnum.STUDENT)(studentLesson),
};
