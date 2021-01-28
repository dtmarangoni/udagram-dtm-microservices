/**
 * Server dev and prod environments variables configuration.
 */
const config = {
    dev: {
        img_mserv_port: process.env.IMG_MSERV_PORT,
        cors_allowed_origin: process.env.IMG_MSERV_CORS_ORIGIN,
        restapi_feed_client_id: process.env.RESTAPI_FEED_CLIENT_ID,
        restapi_feed_private_key: process.env.RESTAPI_FEED_PRIVATE_KEY,
        img_jwt_secret: process.env.IMG_JWT_SECRET,
    },
    prod: {
        cors_allowed_origin: '',
        restapi_client_id: '',
        restapi_private_key: '',
        img_jwt_secret: '',
    },
};

/**
 * Current configuration working mode: dev or prod.
 */
export const currentConfig = config.dev;
