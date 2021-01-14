import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

import { currentConfig } from '../../../../config/config';

/**
 * Middleware to validate if a JWT token was sent in headers.
 * This middleware must be called before the token validators:
 * validateClientJWT and validateAccessJWT.
 * @param req Node Express Request object.
 * @param res Node Express Response object.
 * @param next Middleware next function.
 */
export function requireHeadersJWT(req: Request, res: Response, next: NextFunction) {
    // No authorization field is inside headers
    if (!req?.headers?.authorization) {
        return res.status(401).send({ error: { message: 'No authorization headers.' } });
    }

    // Split the Authorization: "Bearer JWT_TOKEN" to retrieve only the
    // client JWT
    const token = req.headers.authorization.split(' ');
    if (token.length != 2) {
        return res.status(401).send({ error: { message: 'Malformed token.' } });
    }

    // Request contains a well-formed token, thus proceed to next Node
    // Express middleware
    // Attach the token in the current Request
    req.token = token[1];
    return next();
}

/**
 * Middleware to validate if a valid JWT client token was sent in
 * headers.
 * The requireHeadersJWT middleware must be called before this to
 * extract and check if a token is present in headers.
 * @param req Node Express Request object.
 * @param res Node Express Response object.
 * @param next Middleware next function.
 */
export function validateClientJWT(req: Request, res: Response, next: NextFunction) {
    // Get the JWT token
    const token = req.token;

    // Check if the JWT client token is valid
    return jwt.verify(token, currentConfig.restapi_private_key, (err, decoded: any) => {
        if (err) {
            return res
                .status(500)
                .send({ error: { message: "Couldn't validate the client JWT or the token is invalid." } });
        }

        if (!decoded?.client_id || decoded.client_id !== currentConfig.restapi_client_id) {
            return res.status(401).send({ error: { message: 'No access is granted.' } });
        }

        // If its valid proceed to next Node Express middleware
        return next();
    });
}

/**
 * Middleware to validate if a valid JWT access token was sent in
 * headers.
 * The requireHeadersJWT middleware must be called before this to
 * extract and check if a token is present in headers.
 * @param req Node Express Request object.
 * @param res Node Express Response object.
 * @param next Middleware next function.
 */
export function validateAccessJWT(req: Request, res: Response, next: NextFunction) {
    // Get the JWT token
    const token = req.token;

    // Check if the JWT access token is valid
    return jwt.verify(token, currentConfig.img_jwt_secret, (err, decoded) => {
        if (err) {
            return res
                .status(500)
                .send({ error: { message: "Couldn't validate the access JWT or the token is invalid." } });
        }

        // If its valid proceed to next Node Express middleware
        return next();
    });
}
