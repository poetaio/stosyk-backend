const { Client } = require('redis-om');
const { createClient } = require ('redis')

const url = process.env.REDIS_URL

let client;
(async () => {
    const connection = createClient(url)
    await connection.connect()
    client = await new Client().use(connection);
})();

module.exports = {
    client: () => client
};
