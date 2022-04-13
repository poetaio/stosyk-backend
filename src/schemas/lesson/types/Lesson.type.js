const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList} = require("graphql");
const TaskType = require('./Task.type');

module.exports = new GraphQLObjectType({
    name: "LessonType",
    description: "Lesson Type",
    fields: {
        id: { type: GraphQLNonNull(GraphQLID) },
        authorId: { type: GraphQLNonNull(GraphQLID) },
        tasks: { type: GraphQLList(TaskType)}
    }
});
