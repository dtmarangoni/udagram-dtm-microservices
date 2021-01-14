import { Router, Request, Response } from 'express';

import { ImgFilterRouter } from './image-filter/routes/image-filter.router';
import { authRouter } from './auth/routes/auth.router';

const router: Router = Router();

// Router filter for Auth Router
router.use('/auth', authRouter);

// Router filter for Image Filtering Router
router.use('/filteredimage', ImgFilterRouter);

// Send a description of this router root
router.get('/', async (req: Request, res: Response) => {
    return res.send(`V0`);
});

// The index router compiling all nested routers
export const IndexRouter: Router = router;
