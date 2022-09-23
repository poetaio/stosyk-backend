const { GraphQLObjectType, GraphQLNonNull, GraphQLID } = require("graphql");
const OptionAnswerType = require('./OptionAnswer.type');


module.exports = new GraphQLObjectType({
    name: 'StudentAnswerType',
    description: 'Student answer type',
    fields: {
        studentId: { type: GraphQLNonNull(GraphQLID) },
        option: { type: GraphQLNonNull(OptionAnswerType) }
    }
});
