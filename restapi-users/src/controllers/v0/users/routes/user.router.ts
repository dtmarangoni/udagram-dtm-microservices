import { Router, Request, Response } from 'express';

import { User } from '../models/User';
import { AuthRouter } from './auth.router';

const router: Router = Router();

router.use('/auth', AuthRouter);

router.get('/', async (req: Request, res: Response) => {});

// Get the user by it's id (email)
router.get('/:id', async (req: Request, res: Response) => {
    let { id } = req.params;
    const item = await User.findByPk(id);
    return res.send(item);
});

// The user router
export const UserRouter: Router = router;
