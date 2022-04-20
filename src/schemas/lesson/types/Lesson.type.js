const {GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID} = require("graphql");
const TaskType = require("./Task.type");


module.exports = new GraphQLObjectType({
    name: "LessonType",
    description: "Lesson type",
    fields: {
        lessonId: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        tasks: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TaskType))) }
    }
});
