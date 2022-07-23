const { GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList} = require("graphql");
const { SentenceStudentsAnswersType } = require('../sentence');
const TaskTypeEnumType = require("./TaskTypeEnum.type");


module.exports = new GraphQLObjectType({
    name: 'TaskStudentAnswersType',
    description: 'Task student answers type',
    fields: {
        taskId: { type: GraphQLNonNull(GraphQLID) },
        type: { type: GraphQLNonNull(TaskTypeEnumType) },
        sentences: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(SentenceStudentsAnswersType))) }
    }
});
