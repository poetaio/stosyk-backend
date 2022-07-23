const {GraphQLNonNull, GraphQLString, GraphQLInputObjectType} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "AttachmentInputType",
    description: "Attachment type that contains link of item in one of cloud storage provider," +
        " content type (e.g. IMAGE or AUDIO or VIDEO) and title of the attachment ",
    fields: {
        link: {type: GraphQLNonNull(GraphQLString)},
        contentType: {type: GraphQLNonNull(GraphQLString)},
        title: {type: GraphQLNonNull(GraphQLString)}
    }
});