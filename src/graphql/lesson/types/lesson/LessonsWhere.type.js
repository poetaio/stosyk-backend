const { GraphQLID, GraphQLString, GraphQLInputObjectType} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: 'LessonsWhereType',
    description: 'Where for lessons type',
    fields: {
        lessonId: { type: GraphQLID },
        courseId: { type: GraphQLID },
        name: { type: GraphQLString }
    }
});
