const {GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID} = require("graphql");
const {HomeworkInputType} = require("../homework");
const {TaskListInputType} = require("../taskList");


module.exports = new GraphQLInputObjectType({
    name: "LessonInputType",
    description: "Lesson input type",
    fields: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        sections: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TaskListInputType))) },
        homework: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(HomeworkInputType)))},
    }
});
