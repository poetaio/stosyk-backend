const { createClient } = require ('redis')
const {logger} = require('../../utils');

const url = process.env.REDIS_URL;

let client;
(async () => {
    try {
        client = createClient({url, });
        logger.info(`Trying to connect to Redis`);
        await client.connect();
        logger.info(`Created connection to Redis`);
        logger.info(`Creating Redis client..`);

        client.on('error', (err) => logger.debug('Redis client error: ', err));
        client.on('connect', () => logger.debug('Redis client is connected'));
        client.on('reconnecting', () => logger.debug('Redi client is reconnecting'));
        client.on('ready', () => logger.debug('Redis client is ready'));

        logger.info(`Connected to Redis client`);
    } catch (e) {
        logger.error(`Failed to connect to Redis`, e);
    }
})();

module.exports = {
    client: () => client
};
