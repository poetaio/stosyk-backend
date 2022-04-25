const {GraphQLEnumType} = require("graphql");
const {convertToGraphQLEnum, LessonStatusEnum} = require("../../../../utils");


module.exports = new GraphQLEnumType({
    name: "TeacherLessonStatusEnumType",
    values: convertToGraphQLEnum(LessonStatusEnum)
});
