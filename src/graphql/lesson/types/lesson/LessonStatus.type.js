const {GraphQLObjectType, GraphQLNonNull, GraphQLID} = require("graphql");
const LessonStatusEnumType = require("./LessonStatusEnum.type");

module.exports = new GraphQLObjectType({
    name: "LessonStatusType",
    description: "Lesson Status type",
    fields: {
        lessonId: { type: GraphQLNonNull(GraphQLID) },
        status: { type: GraphQLNonNull(LessonStatusEnumType) },
    }
});