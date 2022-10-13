const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString} = require("graphql");
const SchoolInvitationStatusEnumType = require("./SchoolInvitationStatusEnum.type");

module.exports = new GraphQLObjectType({
    name: "SchoolInvitationType",
    description: "Student invitation containing invitation info",
    fields: {
        invitationId: { type: new GraphQLNonNull(GraphQLID) },
        status: { type: new GraphQLNonNull(SchoolInvitationStatusEnumType)},
        inviteEmail: { type: GraphQLString },
    },
});
