import { Request, Response, NextFunction } from 'express';

/**
 * Node Express error handler to take place and threat the raised error
 * in the final of middleware chain.
 * @param err The error that has occurred.
 * @param req Node Express Request object.
 * @param res Node Express Response object.
 * @param next Middleware next function.
 */
export const errorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
    // If err has no error code, set error code to 'Internal Server
    // Error (500)'
    if (!err.statusCode) {
        err.statusCode = 500;
    }

    // Sent the error response to the client
    res.status(err.statusCode).json({ error: { message: err.message } });
};
