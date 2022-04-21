const { LessonType, TaskType } = require("./types");
const { lessonController } = require("../../controllers");
const { GraphQLNonNull, GraphQLID, GraphQLList } = require("graphql");


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

const getLessons = {
    type: GraphQLNonNull(GraphQLList(GraphQLNonNull(LessonType))),
    name: 'getLessons',
    description: 'Gey Lessons',
    //args teacher Id in token
    resolve: async (parent, context) => await lessonController.getLessons(context),
}


module.exports = {
    lesson,
    lessonTasks,
    getLessons,
};
