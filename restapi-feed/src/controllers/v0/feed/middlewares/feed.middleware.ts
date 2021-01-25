import { Request, Response, NextFunction } from "express";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { encode } from "querystring";
import * as jwt from "jsonwebtoken";

import * as AWS from "../../../../aws";
import { currentConfig } from "../../../../config/config";

/**
 * Creat the Feed REST API id token.
 * @returns The signed Feed REST API ID token.
 */
export function generateClientIDJWT(): string {
    return jwt.sign(
        { client_id: currentConfig.restapi_feed_client_id },
        currentConfig.restapi_feed_private_key,
        { expiresIn: 5 * 60 }
    );
}

/**
 * Check if a valid user JWT auth token was sent in headers. To do so,
 * the Feed API server will communicate with the User API server.
 * @param req Node Express Request object.
 * @param res Node Express Response object.
 * @param next Middleware next function.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    // Send the current user JWT token to Users API server validate it
    let authResp: AxiosResponse;
    let axiosConf: AxiosRequestConfig = { headers: { "Content-Type": "application/json" } };

    if (req?.headers?.authorization) {
        axiosConf.headers.Authorization = req.headers.authorization;
    }

    try {
        authResp = await axios.get<{ auth: boolean; message: string }>(
            `${currentConfig.restapi_users_host}/api/v0/users/auth/verification`,
            axiosConf
        );
    } catch (error) {
        return res
            .status(error.response.status)
            .send({ error: { message: error.response.data.message } });
    }

    // Valid user token, proceed to next Node Express middleware
    if (authResp.data.auth) {
        return next();
    } else {
        // User not authorized
        return res.status(authResp.status).send({ error: { message: authResp.data.message } });
    }
}

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
        return res.status(400).json({ error: { message: "Caption is required or malformed" } });
    }

    // Check if the filename is valid
    if (!fileName) {
        return res.status(400).send({ error: { message: "File url is required" } });
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
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${clientIDToken}`,
                },
            }
        );

        // Escape reserved and unsafe characters from public signed url
        const encodedUrl = encode({ image_url: filePublicUrl });
        // Send the url to image filtering microservice process it
        const filteredImgRes = await axios.get(
            `${currentConfig.img_microservice_host}/api/v0/filteredimage?${encodedUrl}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessTokenRes.data.access_token}`,
                },
                responseType: "arraybuffer",
            }
        );

        // Get a put signed url to update the file in AWS S3
        const putSignedUrl = AWS.getPutSignedUrl(fileName);
        // Send the filtered file to AWS S3
        await axios.put(putSignedUrl, filteredImgRes.data, {
            headers: { "Content-Type": filteredImgRes.headers["content-type"] },
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
