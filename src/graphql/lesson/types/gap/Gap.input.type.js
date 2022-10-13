const {GraphQLInputObjectType, GraphQLNonNull, GraphQLInt, GraphQLList} = require("graphql");
const { OptionInputType } = require('../option');


module.exports = new GraphQLInputObjectType({
    name: 'GapInputType',
    description: 'Gap Input Type',
    fields: {
        position: { type: new GraphQLNonNull(GraphQLInt) },
        options: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(OptionInputType)))}
    }
});