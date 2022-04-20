const {GraphQLObjectType, GraphQLBoolean, GraphQLNonNull, GraphQLID, GraphQLString} = require("graphql");


const EmptyType = new GraphQLObjectType({
    name: "EmptyType",
    description: "Type contains no info",
    fields: {
        a: { type: GraphQLBoolean }
    }
});

const StudentType = new GraphQLObjectType({
    name: "StudentType",
    description: "Student type",
    fields: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        // activeLessons
    }
});

const TeacherType = new GraphQLObjectType({
    name: "TeacherType",
    description: "Teacher type",
    fields: {
        id: { type: GraphQLNonNull(GraphQLID) },
        // lessons: GraphQLObjectList(GraphQL)
    }
});

module.exports = {
    EmptyType,
    TeacherType,
    StudentType
};
