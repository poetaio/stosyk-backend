const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString} = require("graphql");


module.exports = new GraphQLObjectType({
    name: 'TeacherType',
    description: 'Teacher type',
    fields: {
        teacherId: { type: new GraphQLNonNull(GraphQLID) },
        email: { type: new GraphQLNonNull(GraphQLString) }
    }
});
