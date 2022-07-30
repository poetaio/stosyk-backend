const {GraphQLInputObjectType, GraphQLID} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: 'HomeworkWhereInputType',
    description: 'Homework Input Type',
    fields: {
        lessonId: { type: GraphQLID },
        homeworkId: { type: GraphQLID },
    },
});
