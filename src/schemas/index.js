const { GraphQLSchema, GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString} = require('graphql');
const { LessonQueries, LessonMutations } = require('./lesson/index');
const { ActiveLessonQueries, ActiveLessonMutations, ActiveLessonSubscriptions } = require('./activeLesson/index');

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        ...ActiveLessonQueries,
        ...LessonQueries
    })
});

const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        ...LessonMutations,
        ...ActiveLessonMutations
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
