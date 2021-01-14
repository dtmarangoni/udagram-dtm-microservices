/**
 * In order to Typescript accept custom properties, in this case a JWT
 * token, to be added in Requests by middlewares, this extension
 * declaration is needed.
 */
declare namespace Express {
    export interface Request {
        token?: string;
    }
}
