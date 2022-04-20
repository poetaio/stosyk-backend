const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList, GraphQLInt} = require("graphql");
const OptionType = require('./Option.type');


module.exports = new GraphQLObjectType({
    name: "GapType",
    description: "Gap type containing list of options and right option",
    fields: {
        id: { type: GraphQLNonNull(GraphQLID) },
        gapPosition: { type: GraphQLNonNull(GraphQLInt) },
        options: { type: GraphQLList(OptionType)},
        rightOption: { type: OptionType }
    }
});
