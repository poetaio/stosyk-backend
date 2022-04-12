const {GraphQLObjectType, GraphQLNonNull, GraphQLString} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "TeacherChangeLessonType",
    description: "Object returned on subscription on teacher changed message event",
    fields: {
        message: { type: GraphQLNonNull(GraphQLString)}
    }
});
