import Router from 'express';

import receiptRouter from './receipt/receipt.router';

const router = Router();

router.use('/receipt', receiptRouter);

export default router;
