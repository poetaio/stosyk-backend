const {GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID} = require("graphql");
const { TaskInputType } = require("../task");


module.exports = new GraphQLInputObjectType({
    name: "LessonInputType",
    description: "Lesson input type",
    fields: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        tasks: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TaskInputType))) }
    }
});
