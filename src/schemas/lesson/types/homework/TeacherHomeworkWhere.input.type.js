const {GraphQLInputObjectType, GraphQLID} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: 'TeacherHomeworkWhereInputType',
    description: 'Homework Input Type',
    fields: {
        lessonId: { type: GraphQLID },
        homeworkId: { type: GraphQLID },
    },
});
