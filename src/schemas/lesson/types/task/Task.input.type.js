const {GraphQLInputObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLList} = require("graphql");
const { SentenceInputType } = require('../sentence');
const TaskTypeEnumType = require("./TaskTypeEnum.type");
const AttachmentInputType = require("./Attachment.input.type");


module.exports = new GraphQLInputObjectType({
    name: 'TaskInputType',
    description: 'TaskInputType',
    fields: {
        answerShown: { type: GraphQLNonNull(GraphQLBoolean) },
        type: { type: GraphQLNonNull(TaskTypeEnumType) },
        sentences: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(SentenceInputType)))},
        attachments: {type: GraphQLNonNull(GraphQLList(GraphQLNonNull(AttachmentInputType)))}
    }
});
