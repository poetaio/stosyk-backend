const { TeacherLessonType, TeacherTaskType, StudentLessonType, StudentTaskType } = require("./types");
const { lessonController } = require("../../controllers");
const { GraphQLNonNull, GraphQLID, GraphQLList } = require("graphql");
const { authMiddleware } = require('../../middleware');
const {UserRoleEnum} = require("../../utils");


const teacherLesson = {
    type: TeacherLessonType,
    name: 'teacherLesson',
    description: 'Get lesson for teacher',
    args: {
        lessonId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await lessonController.getTeacherLesson(parent, args, context)
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

const lessons = {
    type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherLessonType))),
    name: 'getLessons',
    description: 'Get Lessons',
    resolve: async (parent, args, context) => await lessonController.getLessons(context),
};


module.exports = {
    teacherLesson: authMiddleware(UserRoleEnum.TEACHER)(teacherLesson),
    studentLesson: authMiddleware(UserRoleEnum.STUDENT)(studentLesson),
    teacherLessonTasks: authMiddleware(UserRoleEnum.TEACHER)(teacherLessonTasks),
    studentLessonTasks: authMiddleware(UserRoleEnum.STUDENT)(studentLessonTasks),
    lessons: authMiddleware(UserRoleEnum.TEACHER)(lessons),
};
