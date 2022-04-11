const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList} = require("graphql");
const StudentActiveSentenceType = require("./StudentActiveSentence.type");


module.exports = new GraphQLObjectType({
    name: "StudentActiveTaskType",
    description: "Student active task",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        sentences: { type: GraphQLList(StudentActiveSentenceType) }
    })
});
