const {GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID} = require("graphql");


module.exports = new GraphQLObjectType({
    name: "StudentOptionType",
    description: "Student Option  type",
    fields: {
        optionId: { type: new GraphQLNonNull(GraphQLID) },
        value: { type: new GraphQLNonNull(GraphQLString) }
    }
});
