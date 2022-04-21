const { LessonType, LessonInputType} = require("./types");
const {lessonController} = require("../../controllers");
const {GraphQLNonNull, GraphQLID, GraphQLList} = require("graphql");
const TaskType = require("./types/Task.type");

const lesson = {
    type: LessonType,
    name: 'lesson',
    description: 'Get lesson',
    args: {
        lessonId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await lessonController.getLesson(args, context)
};

const lessonTasks = {
    type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TaskType))),
    name: 'lessonTasks',
    description: 'Lesson Tasks',
    args: {
        lessonId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await lessonController.getLessonTasks(args, context)
};


module.exports = {
    lesson,
    lessonTasks
};
