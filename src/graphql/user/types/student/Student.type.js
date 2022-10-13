const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString } = require("graphql");

module.exports = new GraphQLObjectType({
    name: "StudentType",
    description: "Student type",
    fields: {
        studentId: { type: new GraphQLNonNull(GraphQLID) },
        name: { type: new GraphQLNonNull(GraphQLString) },
    }
});
