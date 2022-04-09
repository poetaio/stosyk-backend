const {GraphQLObjectType, GraphQLBoolean} = require("graphql");


const EmptyType = new GraphQLObjectType({
    name: "EmptyType",
    description: "Type contains no info",
    fields: {
        a: { type: GraphQLBoolean }
    }
});

module.exports = {
    EmptyType
}
