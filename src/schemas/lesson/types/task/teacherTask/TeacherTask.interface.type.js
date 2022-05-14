const {GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLList, GraphQLID, GraphQLInterfaceType} = require("graphql");
const TaskTypeEnumType = require("../TaskTypeEnum.type");
const {attachmentController} = require("../../../../../controllers");
const AttachmentType = require("../Attachment.type");
const {TaskTypeEnum} = require("../../../../../utils");
const teacherTaskInterfaceFields = require('./teacherTaskInterfaceFields');

module.exports = new GraphQLInterfaceType({
    name: 'TeacherTaskInterfaceType',
    description: 'Teacher Task Type',
    fields: () => teacherTaskInterfaceFields,
    resolveType: ({ type }, context, info) => {
        if (type === TaskTypeEnum.PLAIN_INPUT) {
            return 'PlainInputTeacherTaskType';
        } else if (type === TaskTypeEnum.MULTIPLE_CHOICE) {
            return 'MultipleChoiceTeacherTaskType';
        } else return null;
    },
});
