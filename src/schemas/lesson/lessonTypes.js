const {GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLInt, GraphQLList} = require("graphql");

const LessonType = new GraphQLObjectType({
    name: "LessonType",
    description: "Lesson Type",
    fields: {
        id: { type: GraphQLNonNull(GraphQLID) },
        authorId: { type: GraphQLNonNull(GraphQLID) }
        // task list
    }
});

const CountedLessonListType = new GraphQLObjectType({
    name: "CountedLessonListType",
    description: "Contains lessons list and total lessons number",
    fields: {
        total: { type: GraphQLNonNull(GraphQLInt) },
        lessonsList: { type: GraphQLNonNull(GraphQLList(LessonType)) }
    }
})

module.exports = {
    LessonType,
    CountedLessonListType
};
