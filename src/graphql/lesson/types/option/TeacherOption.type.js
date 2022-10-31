const {GraphQLObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLString, GraphQLID} = require("graphql");


module.exports = new GraphQLObjectType({
    name: "TeacherOptionType",
    description: "Teacher option  type",
    fields: {
        optionId: { type: new GraphQLNonNull(GraphQLID) },
        value: { type: new GraphQLNonNull(GraphQLString) },
        isCorrect: { type: new GraphQLNonNull(GraphQLBoolean) }
    }
});
