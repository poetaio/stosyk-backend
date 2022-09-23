const {GraphQLNonNull, GraphQLID} = require("graphql");
const TaskTypeEnumType = require("../TaskTypeEnum.type");

module.exports = {
    taskId: { type: GraphQLNonNull(GraphQLID) },
    type: { type: GraphQLNonNull(TaskTypeEnumType) },
};
