import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { encode } from 'querystring';

import { generateClientIDJWT } from '../../users/routes/auth.router';
import * as AWS from '../../../../aws';
import { currentConfig } from '../../../../config/config';


/**
 * Check if the feed data has been sent.
 * @param req Node Express Request object.
 * @param res Node Express Response object.
 * @param next Middleware next function.
 */
export function requireFeedData(req: Request, res: Response, next: NextFunction) {
    const caption = req.body.caption;
    const fileName = req.body.url;

    // Check if the caption is valid
    if (!caption) {
        return res.status(400).json({ error: { message: 'Caption is required or malformed' } });
    }

    // Check if the filename is valid
    if (!fileName) {
        return res.status(400).send({ error: { message: 'File url is required' } });
    }

    // Attach the feed data to request
    req.caption = caption;
    req.fileName = fileName;

    // Proceed to next middleware
    return next();
}

/**
 * Filter the feed image using the image filtering microservice.
 * @param req Node Express Request object.
 * @param res Node Express Response object.
 * @param next Middleware next function.
 */
export async function filterImage(req: Request, res: Response, next: NextFunction) {
    // Get the image file name from request
    const fileName = req.fileName;

    // Get from AWS S3 a public signed url to image microservice have
    // direct access to the object
    const filePublicUrl = AWS.getGetSignedUrl(fileName);

    // Send the image to be filtered in microservice
    try {
        // Create the REST API client token and request the access token
        const clientIDToken = generateClientIDJWT();
        const accessTokenRes = await axios.get<{ access_token: string }>(
            `${currentConfig.img_microservice_host}/api/v0/auth/access-token`,
            {
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${clientIDToken}` },
            }
        );

        // Escape reserved and unsafe characters from public signed url
        const encodedUrl = encode({ image_url: filePublicUrl });
        // Send the url to image filtering microservice process it
        const filteredImgRes = await axios.get(`${currentConfig.img_microservice_host}/api/v0/filteredimage?${encodedUrl}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessTokenRes.data.access_token}`,
            },
            responseType: 'arraybuffer',
        });

        // Get a put signed url to update the file in AWS S3
        const putSignedUrl = AWS.getPutSignedUrl(fileName);
        // Send the filtered file to AWS S3
        await axios.put(putSignedUrl, filteredImgRes.data, {
            headers: { 'Content-Type': filteredImgRes.headers['content-type'] },
        });
    } catch (error) {
        return res.status(500).send({
            error: {
                message: `Error while filtering the image through the image filtering microservice: ${error.message}`,
            },
        });
    }

    // Proceed to next middleware
    return next();
}
