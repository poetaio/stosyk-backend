const {GraphQLInputObjectType, GraphQLNonNull, GraphQLList} = require("graphql");
const QuestionInputType = require("../../Question.input.type");

module.exports = new GraphQLInputObjectType({
    name: "QAInputType",
    description: "QA Input Type",
    fields: {
        questions: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(QuestionInputType))) }
    },
});
