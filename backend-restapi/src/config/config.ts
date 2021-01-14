import { props } from 'bluebird';
import { Dialect } from 'sequelize/types';

const dialect: Dialect = 'postgres';

export const config = {
    dev: {
        restapi_port: process.env.RESTAPI_PORT,
        cors_allowed_origin: process.env.RESTAPI_CORS_ORIGIN,
        username: process.env.POSTGRESS_USERNAME,
        password: process.env.POSTGRESS_PASSWORD,
        database: process.env.POSTGRESS_DATABASE,
        host: process.env.POSTGRESS_HOST,
        dialect: dialect,
        aws_region: process.env.AWS_REGION,
        aws_profile: process.env.AWS_PROFILE,
        aws_media_bucket: process.env.AWS_MEDIA_BUCKET,
        jwt_secret: process.env.JWT_SECRET,
        img_microservice_host: process.env.IMG_MICROSERVICE_HOST,
        restapi_client_id: process.env.RESTAPI_CLIENT_ID,
        restapi_private_key: process.env.RESTAPI_PRIVATE_KEY,
    },
    prod: {
        cors_allowed_origin: '',
        username: '',
        password: '',
        database: '',
        host: '',
        dialect: '',
        aws_region: '',
        aws_profile: '',
        aws_media_bucket: '',
        jwt_secret: '',
        img_microservice_host: '',
    },
};

/**
 * Current configuration working mode: dev or prod.
 */
export const currentConfig = config.dev;