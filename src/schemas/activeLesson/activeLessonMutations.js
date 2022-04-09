const activeLessonController = require('../../controllers/activeLessonController');
const {GraphQLString, GraphQLNonNull, GraphQLID} = require("graphql");
const {EmptyType} = require("../types");

/*
student

enter answer
join lesson
 */

/*
teacher

show answer

 */

// publishes event 'studentChangedLesson'
const studentChange = {
    type: EmptyType,
    description: 'Publishes event "studentChangedLesson"',
    args: {
        studentId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await activeLessonController.studentChangedActiveLesson(args, context)
}

// publishes event 'teacherChangedLesson' because teacher has actually changed something, lol
const teacherChange = {
    type: EmptyType,
    description: 'Publishes event "teacherChangedLesson"',
    args: {
        teacherId: { type: GraphQLNonNull(GraphQLID) },
        teacherMessage: { type: GraphQLNonNull(GraphQLString) }
    },
    resolve: async (parent, args, context) => await activeLessonController.teacherChangedActiveLesson(args, context)
}

module.exports = {
    studentChange,
    teacherChange
}
