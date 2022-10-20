const {GraphQLInputObjectType, GraphQLNonNull, GraphQLList} = require("graphql");
const QuestionInputType = require("../../Question.input.type");

module.exports = new GraphQLInputObjectType({
    name: "QAInputType",
    description: "QA Input Type",
    fields: {
        questions: { type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(QuestionInputType))) }
    },
});
