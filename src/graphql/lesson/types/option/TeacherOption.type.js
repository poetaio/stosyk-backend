const {GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLString, GraphQLID} = require("graphql");


module.exports = new GraphQLObjectType({
    name: "TeacherOptionType",
    description: "Teacher option  type",
    fields: {
        optionId: { type: GraphQLNonNull(GraphQLID) },
        value: { type: GraphQLNonNull(GraphQLString) },
        isCorrect: { type: GraphQLNonNull(GraphQLBoolean) }
    }
});
