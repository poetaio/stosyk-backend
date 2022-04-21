const { lessonController } = require('../../controllers');
const { LessonType, LessonInputType } = require('./types');
const {GraphQLBoolean, GraphQLID, GraphQLNonNull} = require("graphql");


const createLesson = {
    type: GraphQLID,
    name: 'createLesson',
    description: 'Create lesson',
    args: {
        lesson: { type: LessonInputType }
    },
    resolve: async (parent, args, context) => await lessonController.createLesson(args, context)
};

const startLesson = {
    type: GraphQLBoolean,
    name: 'startLesson',
    description: 'Start Lesson',
    args: {
        lessonId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await lessonController.startLesson(args, context)
};

const finishLesson = {
    type: GraphQLBoolean,
    name: 'finishLesson',
    description: 'Finish Lesson',
    args: {
        lessonId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await lessonController.finishLesson(args, context)
};

const showAnswers = {
    type: GraphQLBoolean,
    name: 'showAnswers',
    description: 'Show Answers',
    args: {
        lessonId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await lessonController.showAnswers(args, context)
}

module.exports = {
    createLesson,
    startLesson,
    finishLesson,
    showAnswers,
};
