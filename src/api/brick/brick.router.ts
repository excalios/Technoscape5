import { Router } from 'express';

const router = Router();

router.post('/callback', (req, res) => {
    console.debug(req.body);
    res.success({});
});

export default router;
