// The Node Express entrance point

import express from 'express';
import { sequelize } from './sequelize';
import cors from 'cors';
import bodyParser from 'body-parser';

import { IndexRouter } from './controllers/v0/index.router';
import { V0MODELS } from './controllers/v0/model.index';
import { currentConfig } from './config/config';
import { errorLogger, infoLogger } from './logger.middleware';

// The main method
(async () => {
    // Add or update the models in DB if needed
    await sequelize.addModels(V0MODELS);
    await sequelize.sync();

    // Create the Node Express App
    const app = express();
    // Default port to listen
    const port = currentConfig.restapi_users_port;

    // CORS should be restricted
    app.use(
        cors({
            allowedHeaders: [
                'Origin',
                'X-Requested-With',
                'Content-Type',
                'Accept',
                'X-Access-Token',
                'Authorization',
            ],
            methods: 'GET,HEAD,OPTIONS,POST',
            origin: currentConfig.cors_allowed_origin,
        })
    );

    // Body parser middleware
    app.use(bodyParser.json());

    // Server info logger middleware
    app.use(infoLogger);

    // The router to use for API version V0
    app.use('/api/v0/', IndexRouter);

    // Root URI call
    app.get('/', async (req, res) => {
        return res.send('Users backend REST API');
    });

    // Server error logger middleware
    app.use(errorLogger);

    // Start the Node Express server
    app.listen(port, () => {
        console.log(`Users REST API server running on port:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
})();
