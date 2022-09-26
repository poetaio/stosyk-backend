const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const { LessonTypes, LessonQueries, LessonMutations, LessonSubscriptions } = require('./lesson')
const { UserTypes, UserQueries, UserMutations } = require('./user')
const {PaymentTypes, PaymentQueries, PaymentMutations} = require('./payment')

const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        ...LessonQueries,
        ...UserQueries,
        ...PaymentQueries
    })
});

const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        ...LessonMutations,
        ...UserMutations,
        ...PaymentMutations
    })
});

const RootSubscriptionType = new GraphQLObjectType({
    name: "Subscription",
    description: "Root Subscription",
    fields: () => ({
        ...LessonSubscriptions,
    })
});

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType,
    subscription: RootSubscriptionType,
    types: [
        ...Object.values(UserTypes),
        ...Object.values(LessonTypes),
        ...Object.values(PaymentTypes)
    ],
});
