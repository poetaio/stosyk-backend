const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString} = require("graphql");


module.exports = new GraphQLObjectType({
    name: "OptionType",
    description: "Option type containing option value",
    fields: {
        id: { type: GraphQLNonNull(GraphQLID) },
        value: { type: GraphQLNonNull(GraphQLString) }
    }
});
