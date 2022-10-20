const {GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID} = require("graphql");
const { TaskInputType } = require("../task");
const {HomeworkInputType} = require("../homework");


module.exports = new GraphQLInputObjectType({
    name: "LessonInputType",
    description: "Lesson input type",
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        tasks: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(TaskInputType))) },
        homework: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(HomeworkInputType)))},
    }
});
