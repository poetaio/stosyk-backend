const { TeacherLessonType, TeacherTaskType, StudentLessonType, StudentTaskType, TeacherCountedLessonsType,
    LessonsWhereType
} = require("./types");
const { lessonController } = require("../../controllers");
const { GraphQLNonNull, GraphQLID, GraphQLList } = require("graphql");
const { authMiddleware } = require('../../middleware');
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
    resolve: async (parent, args, context) => await lessonController.getStudentLesson(parent, args, context)
};

const teacherLessonTasks = {
    type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherTaskType))),
    name: 'teacherLessonTasks',
    description: 'Teacher Lesson Tasks',
    args: {
        lessonId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await lessonController.getTeacherLessonTasks(args, context)
};

const studentLessonTasks = {
    type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentTaskType))),
    name:'studentLessonTasks',
    description: 'Student Lesson Tasks',
    args: {
        lessonId: { type: GraphQLNonNull(GraphQLID) }
    },
 }


module.exports = {
    teacherLessons: authMiddleware(UserRoleEnum.TEACHER)(teacherLessons),
    studentLesson: authMiddleware(UserRoleEnum.STUDENT)(studentLesson),
    teacherLessonTasks: authMiddleware(UserRoleEnum.TEACHER)(teacherLessonTasks),
    studentLessonTasks: authMiddleware(UserRoleEnum.STUDENT)(studentLessonTasks),
};
