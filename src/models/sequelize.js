const { Sequelize } = require('sequelize');

const IS_LOCAL_DB = process.env.NODE_ENV === "LOCAL";

module.exports = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        ssl: !IS_LOCAL_DB,
        dialectOptions: {
            ...(!IS_LOCAL_DB && {
                ssl: {
                    required: true,
                    rejectUnauthorized: false
                }
            })
        },
        pool: {
            idle: 10000,
            evict: 1000,
        },
        logging: false
    }
);
