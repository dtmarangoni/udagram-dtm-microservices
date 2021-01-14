import { Router, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { requireHeadersJWT, validateClientJWT, validateAccessJWT } from '../middlewares/auth.middleware';
import { currentConfig } from '../../../../config/config';

const router: Router = Router();

/**
 * Route: http://{{host}}/api/v0/auth/access-token
 *
 * Generate a JWT access token for an authorized and registered client.
 * @returns The JWT access token.
 */
router.get('/access-token', requireHeadersJWT, validateClientJWT, (req: Request, res: Response) => {
    try {
        // For testing purpose the expiration time has been extended
        const token = jwt.sign({ client_id: currentConfig.restapi_client_id }, currentConfig.img_jwt_secret, {
            expiresIn: '60 days',
        });
        return res.status(201).json({ access_token: token });
    } catch (error) {
        return res.status(500).json({ error: { message: 'Error while generating the JWT access token.' } });
    }
});

// The auth router
export const authRouter: Router = router;
