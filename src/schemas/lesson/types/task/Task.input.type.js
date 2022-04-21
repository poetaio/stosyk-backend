const {GraphQLInputObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLList} = require("graphql");
const { SentenceInputType } = require('../sentence');


module.exports = new GraphQLInputObjectType({
    name: 'TaskInputType',
    description: 'TaskInputType',
    fields: {
        answerShown: { type: GraphQLNonNull(GraphQLBoolean) },
        sentences: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(SentenceInputType)))}
    }
});
