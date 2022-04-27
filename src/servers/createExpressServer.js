const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require("express-graphql");

const PORT = process.env.PORT || 5000;

const schema = require('../schemas/index')
const { errorHandlingMiddleware } = require('../middleware');


module.exports = (pubsub) => {
    const app = express();
    app.use(cors());

    app.use('/graphql', cors(), graphqlHTTP((req, res) => ({
        schema,
        context: { pubsub, authHeader: req.header('Authorization') },
        customFormatErrorFn:  (err) => errorHandlingMiddleware(req, res, err)
    })));

    return app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))
};
