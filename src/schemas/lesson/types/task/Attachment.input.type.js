const {GraphQLNonNull, GraphQLString, GraphQLInputObjectType} = require("graphql");

module.exports = new GraphQLInputObjectType({
    name: "AttachmentInputType",
    description: "Attachment type that contains source (link of item in one of cloud storage provider or just plain text)," +
        "content type (e.g. IMAGE or AUDIO or VIDEO or TEXT) and title of the attachment ",
    fields: {
        source: {type: GraphQLNonNull(GraphQLString)},
        contentType: {type: GraphQLNonNull(GraphQLString)},
        title: {type: GraphQLNonNull(GraphQLString)}
    }
});