const { Client } = require('redis-om');
const { createClient } = require ('redis')

const url = process.env.REDIS_URL

let client;
(async () => {
    try {
        const connection = createClient({url});
        console.log(`Trying to connect to Redis`);
        await connection.connect();
        console.log(`Created connection to Redis`);
        console.log(`Creating Redis client..`);
        client = await new Client();
        await client.use(connection);
        console.log(`Connected to heroku client`);
    } catch (e) {
        console.error(`Failed to connect to Redis`, e);
    }
})();

module.exports = {
    client: () => client
};
