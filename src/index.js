require('dotenv').config();
const { PubSub } = require("graphql-subscriptions");

// db init
require('./models/index');
const sequelize = require('./services/dbService');

// servers
const createExpressServer = require('./servers/createExpressServer');
const createWSServer = require('./servers/createWSServer');

// object to manage events' publishing and subscriptions
const pubsub = new PubSub();


const run = async () => {
    try {
        await sequelize.authenticate();
        // await sequelize.sync({force: true});
        await sequelize.sync();

        // inserting test data for active lessons
        // await require('./services/testDataService').createAndLogActiveLessonTeachersAndStudents();

        // initiating servers
        const expressServer = createExpressServer(pubsub);
        createWSServer(expressServer, pubsub);
    } catch (e) {
        console.error(e);
    }
}

run();
