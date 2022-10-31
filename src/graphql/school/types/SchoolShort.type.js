const {GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "SchoolTypeShort",
    description: "School for student",
    fields: {
        schoolId: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
    },
});
