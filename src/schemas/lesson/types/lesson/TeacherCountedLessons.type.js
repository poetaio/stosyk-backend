const {GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLList} = require("graphql");
const TeacherLessonType = require("./TeacherLesson.type");

module.exports = new GraphQLObjectType({
    name: 'TeacherCountedLessonsType',
    description: 'Lessons list with total number for teacher',
    fields: {
        total: { type: GraphQLNonNull(GraphQLInt) },
        lessons: { type: GraphQLNonNull(GraphQLList(GraphQLNonNull(TeacherLessonType)))}
    }
});
