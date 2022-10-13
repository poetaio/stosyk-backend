const {GraphQLInputObjectType, GraphQLNonNull, GraphQLString, GraphQLList, GraphQLID} = require("graphql");
const { TaskInputType } = require("../task");


module.exports = new GraphQLInputObjectType({
    name: "LessonEditInputType",
    description: "Lesson Edit input type",
    fields: {
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        tasks: { type: new GraphQLList(new GraphQLNonNull(TaskInputType)) },
    }
});
