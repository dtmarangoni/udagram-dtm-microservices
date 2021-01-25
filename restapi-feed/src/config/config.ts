import { Dialect } from 'sequelize/types';

const dialect: Dialect = 'postgres';

export const config = {
    dev: {
        restapi_feed_port: process.env.RESTAPI_FEED_PORT,
        cors_allowed_origin: process.env.RESTAPI_FEED_CORS_ORIGIN,
        username: process.env.POSTGRESS_USERNAME,
        password: process.env.POSTGRESS_PASSWORD,
        database: process.env.POSTGRESS_DATABASE,
        host: process.env.POSTGRESS_HOST,
        dialect: dialect,
        aws_region: process.env.AWS_REGION,
        aws_profile: process.env.AWS_PROFILE,
        aws_media_bucket: process.env.AWS_MEDIA_BUCKET,
        restapi_users_host: process.env.RESTAPI_USERS_HOST,
        img_microservice_host: process.env.IMG_MICROSERVICE_HOST,
        restapi_feed_client_id: process.env.RESTAPI_FEED_CLIENT_ID,
        restapi_feed_private_key: process.env.RESTAPI_FEED_PRIVATE_KEY,
    },
    prod: {
        restapi_feed_port: '',
        cors_allowed_origin: '',
        username: '',
        password: '',
        database: '',
        host: '',
        dialect: '',
        aws_region: '',
        aws_profile: '',
        aws_media_bucket: '',
        restapi_users_host: '',
        img_microservice_host: '',
        restapi_client_id: '',
        restapi_private_key: ''
    },
};

/**
 * Current configuration working mode: dev or prod.
 */
export const currentConfig = config.dev;