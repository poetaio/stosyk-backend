const { Client } = require('redis-om');

const url = process.env.REDIS_URL

let client;
(async () => {
    client = await new Client();
    client.open(url);
    console.log(client)
})();

module.exports = {
    client: () => client
};
