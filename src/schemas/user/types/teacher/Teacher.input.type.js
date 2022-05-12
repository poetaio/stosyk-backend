const { GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInputObjectType } = require("graphql");


module.exports = new GraphQLInputObjectType({
    name: 'TeacherInputType',
    description: 'Teacher Input type',
    fields: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) }
    }
});
