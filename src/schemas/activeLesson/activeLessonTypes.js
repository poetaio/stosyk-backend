const {GraphQLNonNull, GraphQLObjectType, GraphQLString} = require("graphql");

const TeacherChangedLessonType = new GraphQLObjectType({
    name: "TeacherChangeLessonType",
    description: "Object returned on subscription on teacher changed message event",
    fields: {
        message: { type: GraphQLNonNull(GraphQLString)}
    }
});

module.exports = {
    TeacherChangedLessonType
};
