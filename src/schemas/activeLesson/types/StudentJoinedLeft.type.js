const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString} = require("graphql");


module.exports = new GraphQLObjectType({
    name: "StudentJoinedLeftType",
    description: "Student joined left type",
    fields: {
        studentId: { type: GraphQLNonNull(GraphQLID) },
        action: { type: GraphQLNonNull(GraphQLString) }
    }
});
