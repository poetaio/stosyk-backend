const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const { LessonTypes, LessonQueries, LessonMutations, LessonSubscriptions } = require('./lesson')
const { SchoolTypes, SchoolQueries, SchoolMutations, SchoolSubscriptions } = require('./school')
const { UserTypes, UserQueries, UserMutations } = require('./user')

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        ...LessonQueries,
        ...UserQueries,
        ...SchoolQueries,
    })
});

const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        ...LessonMutations,
        ...UserMutations,
        ...SchoolMutations,
    })
});

const RootSubscriptionType = new GraphQLObjectType({
    name: "Subscription",
    description: "Root Subscription",
    fields: () => ({
        ...LessonSubscriptions,
        ...SchoolSubscriptions,
    })
});

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
    subscription: RootSubscriptionType,
    types: [
        ...Object.values(UserTypes),
        ...Object.values(LessonTypes),
        ...Object.values(SchoolTypes),
    ],
});
