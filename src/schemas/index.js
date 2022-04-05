const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const { LessonQueries, LessonMutations } = require('./lesson/index');


const RootQueryType = new GraphQLObjectType({
    name: "Query",
    description: "Root Query",
    fields: () => ({
        ...LessonQueries
    })
});

const RootMutationType = new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutation",
    fields: () => ({
        ...LessonMutations
    })
});

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});
