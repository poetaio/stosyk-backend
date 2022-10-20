const {GraphQLInputObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLList, GraphQLString} = require("graphql");
const TaskTypeEnumType = require("../TaskTypeEnum.type");
const AttachmentInputType = require("../Attachment.input.type");
const MultipleChoiceTaskInputType = require('./PlainInputTask.input.type');
const PlainInputTaskInputType = require("./PlainInputTask.input.type");
const MatchingTaskInputType = require("./MatchingTask.input.type");
const QAInputType = require("./QAType.input.type");


module.exports = new GraphQLInputObjectType({
    name: 'TaskInputType',
    description: 'TaskInputType. Each type represented by nullish object',
    fields: () => ({
        answerShown: { type: new GraphQLNonNull(GraphQLBoolean) },
        attachments: {type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(AttachmentInputType)))},
        description: { type: new GraphQLNonNull(GraphQLString) },
        // different types, only one is not null
        // different types, only one is not null or none for MEDIA type
        type: { type: new GraphQLNonNull(TaskTypeEnumType) },

        multipleChoice: { type: MultipleChoiceTaskInputType },
        plainInput: { type: PlainInputTaskInputType },
        matching: { type: MatchingTaskInputType },
        qa: { type: QAInputType },
    })
});
