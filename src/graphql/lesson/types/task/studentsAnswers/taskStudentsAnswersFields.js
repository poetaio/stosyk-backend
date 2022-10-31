const {GraphQLNonNull, GraphQLID} = require("graphql");
const TaskTypeEnumType = require("../TaskTypeEnum.type");

module.exports = {
    taskId: { type: new GraphQLNonNull(GraphQLID) },
    type: { type: new GraphQLNonNull(TaskTypeEnumType) },
};
