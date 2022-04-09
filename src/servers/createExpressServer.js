const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require("express-graphql");

const PORT = process.env.PORT || 5000;

const schema = require('../schemas/index')
const handleError = require('../middleware/errorHandlingMiddleware');


module.exports = (pubsub) => {
    const app = express();

    app.use('/graphql', cors(), graphqlHTTP({
        schema,
        context: { pubsub },
        customFormatErrorFn: err => handleError(err)
    }))

    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))

    return app;
};
