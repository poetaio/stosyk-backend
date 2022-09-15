const {GraphQLInputObjectType, GraphQLNonNull, GraphQLID, GraphQLList} = require("graphql");
const {TaskInputType} = require("../task");
module.exports = new GraphQLInputObjectType({
    name: 'HomeworkInputType',
    description: 'Homework Input Type',
    fields: {
        tasks: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TaskInputType)))},
    }
});
