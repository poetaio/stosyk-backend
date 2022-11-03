const { GraphQLEnumType } = require("graphql");
const {PaymentStatusEnum, convertToGraphQLEnum} = require("../../../utils");

module.exports = new GraphQLEnumType({
    name: "PaymentStatusEnumType",
    values: convertToGraphQLEnum(PaymentStatusEnum)
});
