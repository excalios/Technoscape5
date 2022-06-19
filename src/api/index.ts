import Router from 'express';

import receiptRouter from './receipt/receipt.router';
import brickRouter from './brick/brick.router';

const router = Router();

router.use('/receipt', receiptRouter);
router.use('/brick', brickRouter);

export default router;
