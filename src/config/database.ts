import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from "typeorm";

dotenvConfig({ path: '.env' });

const config = {
    type: 'postgres',
    host: `${process.env.DATABASE_HOST}`,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: `${process.env.DATABASE_USERNAME}`,
    password: `${process.env.DATABASE_PASSWORD}`,
    database: `${process.env.DATABASE_NAME}`,
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/migrations/*{.ts,.js}"],
    autoLoadEntities: false,
    synchronize: false,
    cache: {
        type: "redis",
        options: {
            url: `redis://${process.env.REDIS_HOST_LOCAL}:${process.env.REDIS_PORT}`,
        }
    }
}

// export default registerAs('typeorm', () => config)


export default {
    type: 'postgres',
    host: `${process.env.DATABASE_HOST}`,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: `${process.env.DATABASE_USERNAME}`,
    password: `${process.env.DATABASE_PASSWORD}`,
    database: `${process.env.DATABASE_NAME}`,
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/migrations/*{.ts,.js}"],
    autoLoadEntities: false,
    synchronize: false,
    cache: {
        type: "redis",
        options: {
            url: `redis://${process.env.REDIS_HOST_LOCAL}:${process.env.REDIS_PORT}`,
        }
    }
};

export const connectionSource = new DataSource(config as DataSourceOptions);
