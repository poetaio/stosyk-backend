const {GraphQLObjectType, GraphQLNonNull, GraphQLID} = require("graphql");
const {StudentType} = require("../../../user/types");

module.exports = new GraphQLObjectType({
    name: 'StudentCurrentTaskType',
    description: 'Student Current Task Type',
    fields: {
        taskId: { type: GraphQLNonNull(GraphQLID) },
        student: {type: StudentType}
    }
});
