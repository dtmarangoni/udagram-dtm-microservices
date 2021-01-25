import express from 'express';
import bodyParser from 'body-parser';

import { IndexRouter } from './controllers/V0/index.router';
import { currentConfig } from './config/config';
import { infoLogger, errorLogger } from './logger.middleware';

// The server main entrance function
(async () => {
    // Init the Express application
    const app = express();

    // Set the network port
    const port = currentConfig.img_mserv_port;

    // CORS should be restricted
    app.use(function (req, res, next) {
        // CORS headers
        res.header('Access-Control-Allow-Origin', currentConfig.cors_allowed_origin);
        res.header(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept, Authorization'
        );

        // Proceed to next middleware
        return next();
    });

    // Use the body parser middleware for post requests
    app.use(bodyParser.json());

    // Server info logger middleware
    app.use(infoLogger);

    // The router to use for API version V0
    app.use('/api/v0', IndexRouter);

    // Root Endpoint
    // Displays a simple message to the user
    app.get('/', async (req, res) => {
        return res.send('Image Filtering Microservice');
    });

    // Server error logger middleware
    app.use(errorLogger);

    // Start the Server
    app.listen(port, () => {
        console.log(`Image Filter Microservice running on port:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
})();
