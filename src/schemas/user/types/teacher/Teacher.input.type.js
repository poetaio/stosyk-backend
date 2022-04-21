const { GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInputObjectType } = require("graphql");


module.exports = new GraphQLInputObjectType({
    name: 'TeacherType',
    description: 'Teacher type',
    fields: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) }
    }
});
