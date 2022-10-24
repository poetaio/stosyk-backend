const {InternalError} = require("./errors");

/**
 * Looking for all variables in mailTemplates like {{ name }} and replacing them
 * with those in data object
 * kinda custom template engine
 */
module.exports = (html, data) => {
    return html.replace(/\{\{(.+?)\}\}/g, (_, g) => {
        if (!data[g.trim()]) {
            throw new InternalError(`Unable to find variable ${g.trim()}`);
        }

        return data[g.trim()];
    });
};
