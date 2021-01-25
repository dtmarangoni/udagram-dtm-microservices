import { Dialect } from 'sequelize/types';

const dialect: Dialect = 'postgres';

export const config = {
    dev: {
        restapi_users_port: process.env.RESTAPI_USERS_PORT,
        cors_allowed_origin: process.env.RESTAPI_USERS_CORS_ORIGIN,
        username: process.env.POSTGRESS_USERNAME,
        password: process.env.POSTGRESS_PASSWORD,
        database: process.env.POSTGRESS_DATABASE,
        host: process.env.POSTGRESS_HOST,
        dialect: dialect,
        jwt_secret: process.env.JWT_SECRET
    },
    prod: {
        restapi_users_port: '',
        cors_allowed_origin: '',
        username: '',
        password: '',
        database: '',
        host: '',
        dialect: '',
        jwt_secret: ''
    },
};

/**
 * Current configuration working mode: dev or prod.
 */
export const currentConfig = config.dev;