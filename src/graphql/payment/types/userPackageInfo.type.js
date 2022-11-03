const {GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLID, GraphQLBoolean, GraphQLString} = require("graphql");

module.exports = new GraphQLObjectType({
    name: "userPackageInfoType",
    description: "User Package Info Type",
    fields: {
        packageId: {type: new GraphQLNonNull(GraphQLID)},
        seats: {type : new GraphQLNonNull(GraphQLInt)},
        months: {type: new GraphQLNonNull(GraphQLInt)},
        expired: {type: new GraphQLNonNull(GraphQLBoolean)},
        startDate: {type: new GraphQLNonNull(GraphQLString)}
    },
});
