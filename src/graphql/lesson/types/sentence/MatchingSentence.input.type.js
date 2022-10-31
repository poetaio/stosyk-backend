const {GraphQLInputObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList} = require("graphql");
const {MatchingOptionInputType} = require("../option");


module.exports = new GraphQLInputObjectType({
    name: 'MatchingSentenceInputType',
    description: 'MatchingSentenceInputType. Contains only one right "connect" option, represented by string',
    fields: {
        index: { type: new GraphQLNonNull(GraphQLInt) },
        text: { type: new GraphQLNonNull(GraphQLString) },
        correctOption: { type: new GraphQLNonNull(MatchingOptionInputType) },
    }
});
