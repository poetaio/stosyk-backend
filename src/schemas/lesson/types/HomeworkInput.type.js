const {GraphQLInputObjectType, GraphQLNonNull, GraphQLID, GraphQLList} = require("graphql");
const {TaskInputType} = require("./task");
module.exports = new GraphQLInputObjectType({
    name: 'HomeworkInputType',
    description: 'Homework Input Type',
    fields: {
        lessonId: { type: GraphQLNonNull(GraphQLID) },
        tasks: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TaskInputType)))},
    }
});
