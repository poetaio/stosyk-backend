const {GraphQLObjectType, GraphQLNonNull, GraphQLID, GraphQLString} = require("graphql");
const SchoolInvitationStatusEnumType = require("./SchoolInvitationStatusEnum.type");
const SchoolShortType = require("../SchoolShort.type");
const {schoolController} = require("../../../../controllers/school");

module.exports = new GraphQLObjectType({
    name: "SchoolInvitationType",
    description: "Student invitation containing invitation info",
    fields: {
        invitationId: { type: new GraphQLNonNull(GraphQLID) },
        status: { type: new GraphQLNonNull(SchoolInvitationStatusEnumType)},
        inviteEmail: { type: new GraphQLNonNull(GraphQLString) },
        createdAt: { type: new GraphQLNonNull(GraphQLString) },
        school: {
            type: new GraphQLNonNull(SchoolShortType),
            resolve: async (parent, args, context) => await schoolController.getOneById(parent)
        },
    },
});
