const { GraphQLNonNull, GraphQLID, GraphQLInputObjectType, GraphQLString} = require("graphql");
const MultipleChoiceAnswerInputType = require('./MultipleChoiceAnswer.input.type');
const MatchingAnswerInputType = require('./MatchingAnswer.input.type');
const PlainInputAnswerInputType = require('./PlainInputAnswer.input.type');
const QAAnswerInputType = require('./QAAnswer.input.type');
const {TaskTypeEnumType} = require("../task");


module.exports = new GraphQLInputObjectType({
    name: "AnswerInputType",
    description: "Contains lessonId, taskId and type, and one of corresponding to type objects",
    fields: {
        lessonId: { type: new GraphQLNonNull(GraphQLID) },
        taskId: { type: new GraphQLNonNull(GraphQLID) },

        // corresponding object is not null
        type: { type: new GraphQLNonNull(TaskTypeEnumType) },

        multipleChoice: { type: MultipleChoiceAnswerInputType },
        plainInput: { type: PlainInputAnswerInputType },
        qa: { type: QAAnswerInputType },
        matching: { type: MatchingAnswerInputType },
    }
});
