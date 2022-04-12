const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList, GraphQLBoolean} = require("graphql");
const TeacherActiveSentenceType = require('./TeacherActiveSentence.type');


module.exports = new GraphQLObjectType({
    name: "TeacherActiveTaskType",
    description: "Active task type",
    fields: {
        id: { type: GraphQLNonNull(GraphQLID) },
        sentences: { type: GraphQLList(TeacherActiveSentenceType) },
        answerShown: { type: GraphQLNonNull(GraphQLBoolean) }
    }
});
