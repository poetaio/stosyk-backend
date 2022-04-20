const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLList} = require("graphql");
const StudentActiveOptionType = require("./StudentActiveOption.type");


// showing only available options
module.exports = new GraphQLObjectType({
    name: "StudentAnswerToType",
    description: "Student Answer To Type",
    fields: {
        id: { type: GraphQLNonNull(GraphQLID) },
        text: { type: GraphQLNonNull(GraphQLString) },
        options: { type: GraphQLList(StudentActiveOptionType) }
    }
});
