// import "reflect-metadata";
import { DataSource } from "typeorm";

const dbUrl = process.env.DATABASE_URL;

export const AppDataSource = new DataSource({
    type: 'postgres',
    synchronize: false,
    logging: false,
    entities: ['./entities/**/*.entity.ts'],
    migrations: [],
    subscribers: [],
    ...(dbUrl
        ? {
            url: dbUrl,
        }
        : {
            host: process.env.DB_HOST,
            port: Number.parseInt(String(process.env.DB_PORT || 5432)),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        }
    ),
    ...(process.env.DB_SSL && {
        ssl: true
    }),
});
