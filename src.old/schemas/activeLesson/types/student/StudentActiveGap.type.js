const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLList, GraphQLString} = require("graphql");
const StudentActiveOptionType = require("./StudentActiveOption.type");


// adding right Option, can be null, if !answerShown
module.exports = new GraphQLObjectType({
    name: "StudentActiveGapType",
    description: "Student active gap type",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLID) },
        text: { type: GraphQLNonNull(GraphQLString) },
        options: { type: GraphQLList(StudentActiveOptionType) },
        rightOption: { type: StudentActiveOptionType }
    })
});
