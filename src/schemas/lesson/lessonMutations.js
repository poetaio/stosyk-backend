const { lessonController } = require('../../controllers');
const { LessonInputType, AnswerInputType } = require('./types');
const { GraphQLBoolean, GraphQLID, GraphQLNonNull } = require("graphql");


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

const deleteLesson = {
    type: GraphQLBoolean,
    name: 'deleteLesson',
    description: 'Delete Lesson',
    args:{
        lessonId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await lessonController.deleteLesson(args, context)
}

const joinLesson = {
    type: GraphQLBoolean,
    name: 'joinLesson',
    description: 'Join Lesson',
    args:{
        lessonId: { type: GraphQLNonNull(GraphQLID) }
    },
    resolve: async (parent, args, context) => await lessonController.joinLesson(args, context)

}

const setAnswer = {
    type: GraphQLBoolean,
    name: 'setAnswer',
    description: 'Set Answer',
    args:{
        lessonId: { type: GraphQLNonNull(GraphQLID) },
        answer: { type: GraphQLNonNull(AnswerInputType)}
    },
    resolve: async (parent, args, context) => await lessonController.setAnswer(args, context)
}


module.exports = {
    // lesson
    createLesson,
    startLesson,
    finishLesson,
    showAnswers,
    deleteLesson,

    // student
    joinLesson,
    setAnswer,
};
