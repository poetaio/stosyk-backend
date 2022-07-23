const dotenv = require('dotenv');
dotenv.config();

const config = {
    development: {
        database: process.env.DB_NAME,
        password: process.env.DB_USER,
        username: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgresql',
        ...(process.env.DB_SSL && {
            ssl: {
                required: true,
                rejectUnauthorized: false
            }
        }),
        pool: {
            idle: 10001,
            evict: 1000,
        },
        logging: false,
    },
    production: {
        database: process.env.DB_NAME,
        password: process.env.DB_USER,
        username: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgresql',
        dialectOptions: {
        },
        ssl: {
            required: true,
            rejectUnauthorized: false
        },
        pool: {
            idle: 10002,
            evict: 1000,
        },
        logging: false,
    }
};

module.exports = config;
