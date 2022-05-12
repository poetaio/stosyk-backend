const {GraphQLInputObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLList, GraphQLInterfaceType} = require("graphql");
const TaskTypeEnumType = require("../TaskTypeEnum.type");
const AttachmentInputType = require("../Attachment.input.type");
const MultipleChoiceTaskInputType = require('./PlainInputTask.input.type');
const PlainInputTaskInputType = require("./PlainInputTask.input.type");


module.exports = new GraphQLInputObjectType({
    name: 'TaskInputType',
    description: 'TaskInputType',
    fields: () => ({
        answerShown: { type: GraphQLNonNull(GraphQLBoolean) },
        attachments: {type: GraphQLNonNull(GraphQLList(GraphQLNonNull(AttachmentInputType)))},
        type: { type: GraphQLNonNull(TaskTypeEnumType) },
        multipleChoice: { type: MultipleChoiceTaskInputType },
        plainInput: { type: PlainInputTaskInputType },
    })
});
