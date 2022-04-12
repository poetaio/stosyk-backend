const {GraphQLObjectType, GraphQLNonNull, GraphQLString, GraphQLID} = require("graphql");


module.exports = new GraphQLObjectType({
    name: "StudentActiveOptionType",
    description: "Student Active Option Type",
    fields: {
        id: { type: GraphQLNonNull(GraphQLID) } ,
        value: { type: GraphQLNonNull(GraphQLString) }
    }
});
