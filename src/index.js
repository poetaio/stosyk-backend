require('dotenv').config();
const {PubSub} = require("graphql-subscriptions");

// db init
require('./db/models');
const {sequelize} = require('./db/models');

// servers
const createExpressServer = require('./servers/createExpressServer');
const createWSServer = require('./servers/createWSServer');


// object to manage events' publishing and subscriptions
const pubsub = new PubSub();

const run = async () => {
    try {
        await sequelize.authenticate();

        // initiating servers
        const [expressServer, httpServer] = createExpressServer(pubsub);
        await createWSServer(httpServer, expressServer, pubsub);
    } catch (e) {
        console.error(e);
    }
}

run();
