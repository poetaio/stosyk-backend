require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require("express-graphql");

const PORT = process.env.PORT || 5000;

require('./models/index');
const sequelize = require('./services/dbService');

const schema = require('./schemas/index')

const handleError = require('./middleware/errorHandlingMiddleware');

const app = express();

app.use('/graphql', cors(), graphqlHTTP({
    schema: schema,
    customFormatErrorFn: err => handleError(err)
}))

const run = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({force: true});
        app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
    } catch (e) {
        console.error(e);
    }
}

run();
