const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString} = require("graphql");


module.exports = new GraphQLObjectType({
    name: 'TeacherType',
    description: 'Teacher type',
    fields: {
        teacherId: { type: GraphQLNonNull(GraphQLID) },
        email: { type: GraphQLNonNull(GraphQLString) }
    }
});
