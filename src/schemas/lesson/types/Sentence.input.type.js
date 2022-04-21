const {GraphQLInputObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList} = require("graphql");
const GapInputType = require('./Gap.input.type');


module.exports = new GraphQLInputObjectType({
    name: 'SentenceInputType',
    description: 'Sentence Input Type',
    fields: {
        index: { type: GraphQLNonNull(GraphQLInt) },
        text: { type: GraphQLNonNull(GraphQLString) },
        gaps: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GapInputType)))}
    }
});
