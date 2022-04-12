const {GraphQLObjectType, GraphQLNonNull, GraphQLID} = require("graphql");
const {TeacherType} = require("../../types");


module.exports = new GraphQLObjectType({
    name: "ShortLessonType",
    description: "Short lesson type containing id and author",
    fields: {
        id: { type: GraphQLNonNull(GraphQLID) },
        author: { type: TeacherType }
    }
});
