const {GraphQLInputObjectType, GraphQLNonNull, GraphQLInt, GraphQLList} = require("graphql");
const OptionInputType = require('./Option.input.type');


module.exports = new GraphQLInputObjectType({
    name: 'GapInputType',
    description: 'Gap Input Type',
    fields: {
        position: { type: GraphQLNonNull(GraphQLInt) },
        options: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(OptionInputType)))}
    }
});