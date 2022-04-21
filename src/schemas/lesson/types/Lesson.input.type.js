const {GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID} = require("graphql");
const TaskInputType = require("./Task.input.type");


module.exports = new GraphQLInputObjectType({
    name: "LessonInputType",
    description: "Lesson input type",
    fields: {
        name: { type: GraphQLNonNull(GraphQLString) },
        tasks: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TaskInputType))) }
    }
});
