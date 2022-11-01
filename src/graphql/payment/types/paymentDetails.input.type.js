const {GraphQLNonNull, GraphQLInputObjectType, GraphQLInt} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "PaymentDetailsInputType",
    description: "Payment Details Input Type",
    fields: {
        seats: {type : new GraphQLNonNull(GraphQLInt)},
        months: {type: new GraphQLNonNull(GraphQLInt)},
    },
});
