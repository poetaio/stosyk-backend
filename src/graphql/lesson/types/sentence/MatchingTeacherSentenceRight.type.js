const {GraphQLInputObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList, GraphQLID, GraphQLObjectType} = require("graphql");
const { GapInputType } = require('../gap');
const { MatchingTeacherOptionType } = require("../option");


module.exports = new GraphQLObjectType({
    name: 'MatchingTeacherSentenceRightType',
    description: 'MatchingTeacherSentenceRightType. Contains id and value',
    fields: {
        optionId: { type: new GraphQLNonNull(GraphQLID) },
        value: { type: new GraphQLNonNull(GraphQLString) },
    }
});
