import { Request, Response, NextFunction } from 'express';

import { currentConfig } from '../config/config';

/**
 * Middleware to set CORS headers.
 * @param req Node Express Request object.
 * @param res Node Express Response object.
 * @param next Middleware next function.
 */
export function setCORS(req: Request, res: Response, next: NextFunction) {
    // Allowed origins
    const allowedOrigins = [currentConfig.cors_allowed_origin];

    // CORS headers only accept one origin per time, so get it if it's
    // inside the allowed origins array
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    // Set the allowed headers
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    // Proceed to next middleware
    return next();
}
