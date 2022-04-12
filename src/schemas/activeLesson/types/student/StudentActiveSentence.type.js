const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList} = require("graphql");
const StudentActiveOptionType = require("./StudentActiveOption.type");


module.exports = new GraphQLObjectType({
    name: "StudentActiveSentenceType",
    description: "Student active sentence type",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        options: { type: GraphQLList(StudentActiveOptionType) }
    })
});
