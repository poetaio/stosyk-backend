const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const { LessonQueries, LessonMutations } = require('./lesson');
const { ActiveLessonQueries, ActiveLessonMutations, ActiveLessonSubscriptions } = require('./activeLesson');
const { StudentQueries, StudentMutations } = require('./student');
const { TeacherQueries, TeacherMutations } = require('./teacher');


const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        ...ActiveLessonQueries,
        ...LessonQueries,
        ...StudentQueries,
        ...TeacherQueries
    })
});

const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        ...LessonMutations,
        ...ActiveLessonMutations,
        ...StudentMutations,
        ...TeacherMutations
    })
});

const RootSubscriptionType = new GraphQLObjectType({
    name: "Subscription",
    description: "Root Subscription",
    fields: () => ({
        ...ActiveLessonSubscriptions
    })
});

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
    subscription: RootSubscriptionType
});
