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

        client.on('error', (err) => logger.error('Redis client error: ', err));
        client.on('connect', () => logger.info('Redis client is connected'));
        client.on('reconnecting', () => logger.info('Redi client is reconnecting'));
        client.on('ready', () => logger.info('Redis client is ready'));

        logger.info(`Connected to Redis client`);
    } catch (e) {
        logger.error(`Failed to connect to Redis`, e);
    }
})();

module.exports = {
    client: () => client
};
