const {GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID} = require("graphql");
const { TaskType } = require("../task");


module.exports = new GraphQLObjectType({
    name: "LessonType",
    description: "Lesson type",
    fields: {
        lessonId: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        tasks: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TaskType))) }
    }
});
