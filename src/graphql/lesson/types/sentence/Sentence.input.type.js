const {GraphQLInputObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList} = require("graphql");
const { GapInputType } = require('../gap');


module.exports = new GraphQLInputObjectType({
    name: 'SentenceInputType',
    description: 'Sentence Input Type',
    fields: {
        index: { type: new GraphQLNonNull(GraphQLInt) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        gaps: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GapInputType)))}
    }
});
