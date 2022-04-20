const {GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLID} = require("graphql");
const OptionType = require("./Option.type");

module.exports = new GraphQLObjectType({
    name: 'GapType',
    description: 'Gap Type',
    fields: {
        gapId: { type: GraphQLNonNull(GraphQLID) },
        position: { type: GraphQLNonNull(GraphQLInt) },
        options: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(OptionType)))}
    }
});
