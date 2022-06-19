import { Router } from 'express';

const router = Router();

router.post('/callback', (req, _) => {
    console.debug(req.body);
});

export default router;
