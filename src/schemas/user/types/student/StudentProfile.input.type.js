const {GraphQLNonNull, GraphQLString, GraphQLInputObjectType} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "StudentProfileType",
    description: "Student Profile type",
    fields: {
        name: { type: GraphQLNonNull(GraphQLString) },
    }
});