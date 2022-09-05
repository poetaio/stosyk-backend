const {GraphQLInputObjectType, GraphQLNonNull, GraphQLID, GraphQLList} = require("graphql");
const {TaskListInputType} = require("../taskList");
module.exports = new GraphQLInputObjectType({
    name: 'HomeworkInputType',
    description: 'Homework Input Type',
    fields: {
        sections: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TaskListInputType)))},
    }
});
