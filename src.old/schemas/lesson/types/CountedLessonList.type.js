const {GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLList} = require("graphql");
const ShortLessonType = require('./ShortLesson.type');

module.exports = new GraphQLObjectType({
    name: "CountedLessonListType",
    description: "Contains lessons list and total lessons number",
    fields: {
        total: { type: GraphQLNonNull(GraphQLInt) },
        lessonsList: { type: GraphQLNonNull(GraphQLList(ShortLessonType)) }
    }
});
