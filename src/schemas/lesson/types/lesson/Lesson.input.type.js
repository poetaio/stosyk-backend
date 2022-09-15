const {GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID} = require("graphql");
const { TaskInputType } = require("../task");
const {HomeworkInputType} = require("../homework");


module.exports = new GraphQLInputObjectType({
    name: "LessonInputType",
    description: "Lesson input type",
    fields: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        tasks: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TaskInputType))) },
        homework: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(HomeworkInputType)))},
    }
});
