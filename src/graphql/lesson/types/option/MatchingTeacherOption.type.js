const {GraphQLInputObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLString, GraphQLInt, GraphQLID, GraphQLObjectType} = require("graphql");


module.exports = new GraphQLObjectType({
    name: "MatchingTeacherOptionType",
    description: "Contains id, value, and position(index) in right \"column\"",
    fields: {
        optionId: { type: GraphQLNonNull(GraphQLID) },
        value: { type: GraphQLNonNull(GraphQLString) },
        rightColumnPosition: { type: GraphQLNonNull(GraphQLInt) },
    }
});
