import { Router, Request, Response } from 'express';

import { User } from '../models/User';

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { NextFunction } from 'connect';

import * as EmailValidator from 'email-validator';
import { currentConfig } from '../../../../config/config';


const router: Router = Router();

// Generate a hash from a plain password text
async function generatePassword(plainTextPassword: string): Promise<string> {
    return bcrypt.hash(plainTextPassword, 10);
}

// Check if the plain password match to it's hash
async function comparePasswords(plainTextPassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hash);
}

// Create a user signed JWT token
function generateUserJWT(user: User): string {
    // For testing purpose the expiration date of the token has been
    // increased.
    return jwt.sign({ email: user.email }, currentConfig.jwt_secret, { expiresIn: '60 days' });
}

// Create the REST API client id token
export function generateClientIDJWT(): string {
    return jwt.sign({ client_id: currentConfig.restapi_client_id }, currentConfig.restapi_private_key, { expiresIn: 5 * 60 });
}

// Middleware to validate if a valid user JWT auth token was sent in
// headers
export function requireAuth(req: Request, res: Response, next: NextFunction) {
    // No authorization field is inside headers
    if (!req?.headers?.authorization) {
        return res.status(401).send({ error: { message: 'No authorization headers.' } });
    }

    // Split the Authorization: "Bearer JWT_TOKEN" to retrieve only the
    // user JWT
    const token_bearer = req.headers.authorization.split(' ');
    if (token_bearer.length != 2) {
        return res.status(401).send({ error: { message: 'Malformed token.' } });
    }

    // Get the JWT token
    const token = token_bearer[1];

    // Check if the user JWT token is valid
    return jwt.verify(token, currentConfig.jwt_secret, (err, decoded) => {
        if (err) {
            return res.status(500).send({ auth: false, error: { message: 'Failed to authenticate.' } });
        }

        // If its valid proceed to next Node Express middleware
        return next();
    });
}

// Verify if the user is authenticated through the JWT token
router.get('/verification', requireAuth, async (req: Request, res: Response) => {
    return res.status(200).send({ auth: true, error: { message: 'Authenticated.' } });
});

// Login an user through email and password
router.post('/login', async (req: Request, res: Response) => {
    const email = req.body.email;
    const password = req.body.password;

    // Check if email field isn't empty or malformed
    if (!email || !EmailValidator.validate(email)) {
        return res.status(400).send({ auth: false, error: { message: 'Email is required or malformed' } });
    }

    // Check if the password field isn't empty
    if (!password) {
        return res.status(400).send({ auth: false, error: { message: 'Password is required' } });
    }

    // Check if user exists by email address
    const user = await User.findByPk(email);
    if (!user) {
        return res.status(401).send({ auth: false, error: { message: 'Unauthorized' } });
    }

    // Check if the user password is valid
    const authValid = await comparePasswords(password, user.password_hash);

    // Send the error response in case of invalid password
    if (!authValid) {
        return res.status(401).send({ auth: false, error: { message: 'Unauthorized' } });
    }

    // After a successful login, generate the user JWT token
    const jwt = generateUserJWT(user);

    // Respond with the JWT token and with the logged user email.
    return res.status(200).send({ auth: true, token: jwt, user: user.short() });
});

// Register a new user
router.post('/', async (req: Request, res: Response) => {
    const email = req.body.email;
    const plainTextPassword = req.body.password;

    // Check if email field isn't empty or malformed
    if (!email || !EmailValidator.validate(email)) {
        return res.status(400).send({ auth: false, error: { message: 'Email is missing or malformed' } });
    }

    // Check if password field isn't empty
    if (!plainTextPassword) {
        return res.status(400).send({ auth: false, error: { message: 'Password is required.' } });
    }

    // Find the user by email
    const user = await User.findByPk(email);
    // Check if the user is already registered
    if (user) {
        return res.status(422).send({ auth: false, error: { message: 'User may already exists.' } });
    }

    // Generate the password hash
    const password_hash = await generatePassword(plainTextPassword);

    // Create the user model
    const newUser = new User({
        email: email,
        password_hash: password_hash,
    });

    // Save the user in DB
    let savedUser;
    try {
        savedUser = await newUser.save();
    } catch (e) {
        throw e;
    }

    // Generate a signed user JWT token
    const jwt = generateUserJWT(savedUser);

    // Respond with the user JWT and email address
    return res.status(201).send({ token: jwt, user: savedUser.short() });
});

// Send a description of this route root
router.get('/', async (req: Request, res: Response) => {
    return res.send('auth');
});

// The auth router
export const AuthRouter: Router = router;
