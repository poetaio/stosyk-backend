const {StudentLessonType, TeacherCountedLessonsType, LessonsWhereType, CourseType, TeacherHomeworkType,
    HomeworkWhereInputType, StudentHomeworkType
} = require("./types");
const { lessonController, courseController, homeworkController} = require("../../controllers");
const { GraphQLNonNull, GraphQLID, GraphQLList} = require("graphql");
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

const getAllCourses = {
    type: GraphQLNonNull(GraphQLList(GraphQLNonNull(CourseType))),
    name: 'getAllCourses',
    description: 'Get All Courses',
    resolve: async (parent, args, context) => await courseController.getAllCourses(context)
}


const teacherHomework = {
    type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherHomeworkType))),
    name: 'teacherHomework',
    description: 'Get teacher homework by lesson id',
    args: {
        where: { type: GraphQLNonNull(HomeworkWhereInputType)},
    },
    resolve: async (parent, args, context) => await homeworkController.getAllForTeacher(args, context),
}

const studentHomework = {
    type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentHomeworkType))),
    name: 'studentHomework',
    description: 'Get student homework by lesson id or by homework id or both',
    args: {
        where: { type: GraphQLNonNull(HomeworkWhereInputType)},
    },
    resolve: async (parent, args, context) => await homeworkController.getAllForStudent(args, context),
}

const teacherLessonHistory = {
    type: GraphQLNonNull(TeacherCountedLessonsType),
    name: 'teacherLessonHistory',
    description: 'Get all lessons that were run by teacher',
    resolve: async (parent, args, context) => await lessonController.getTeacherLessonHistory(context),
}


module.exports = {
    //TEACHER
    teacherLessons: resolveAuthMiddleware(UserRoleEnum.TEACHER)(teacherLessons),
    getAllCourses: resolveAuthMiddleware(UserRoleEnum.TEACHER)(getAllCourses),
    teacherHomework: resolveAuthMiddleware(UserRoleEnum.TEACHER)(teacherHomework),
    teacherLessonHistory: resolveAuthMiddleware(UserRoleEnum.TEACHER)(teacherLessonHistory),

    //STUDENT
    studentLesson: resolveAuthMiddleware(UserRoleEnum.STUDENT)(studentLesson),
    studentHomework: resolveAuthMiddleware(UserRoleEnum.STUDENT)(studentHomework),
    // studentGetAnswers: resolveAuthMiddleware(UserRoleEnum.STUDENT)(studentGetAnswers)
};
