const {GraphQLObjectType, GraphQLNonNull, GraphQLString } = require("graphql");

module.exports = new GraphQLObjectType({
    name: "StudentProfileType",
    description: "Student Profile type",
    fields: {
        name: { type: GraphQLNonNull(GraphQLString) },
    }
});
