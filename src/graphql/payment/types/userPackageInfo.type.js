const {GraphQLNonNull, GraphQLObjectType, GraphQLInt, GraphQLID, GraphQLString} = require("graphql");
const paymentStatusEnumType = require('./paymentStatusEnum.type')

module.exports = new GraphQLObjectType({
    name: "userPackageInfoType",
    description: "User Package Info Type",
    fields: {
        packageId: {type: new GraphQLNonNull(GraphQLID)},
        seats: {type : new GraphQLNonNull(GraphQLInt)},
        months: {type: new GraphQLNonNull(GraphQLInt)},
        status: {type: new GraphQLNonNull(paymentStatusEnumType)},
        startDate: {type: GraphQLString}
    },
});
