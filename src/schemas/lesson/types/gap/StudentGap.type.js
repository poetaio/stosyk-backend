const {GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLList, GraphQLID} = require("graphql");
const { StudentOptionType } = require("../option");

module.exports = new GraphQLObjectType({
    name: 'StudentGapType',
    description: 'Student Gap Type',
    fields: {
        gapId: { type: GraphQLNonNull(GraphQLID) },
        position: { type: GraphQLNonNull(GraphQLInt) },
        options: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(StudentOptionType)))}
    }
});
