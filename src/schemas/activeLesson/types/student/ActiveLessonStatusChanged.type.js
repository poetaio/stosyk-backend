const {GraphQLObjectType, GraphQLString, GraphQLNonNull} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "ActiveLessonStatusChangedType",
    description: "ActiveLessonStatusChangedType contains status",
    fields: {
        status: { type: GraphQLNonNull(GraphQLString) }
    }
});
