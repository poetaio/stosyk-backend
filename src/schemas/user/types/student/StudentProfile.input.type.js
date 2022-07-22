const {GraphQLInputObjectType, GraphQLNonNull, GraphQLString } = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "StudentProfileInputType",
    description: "Student Profile input type",
    fields: {
        name: { type: GraphQLNonNull(GraphQLString) },
    }
});
