// eslint-disable-next-line @typescript-eslint/no-redeclare
import { Router, Request, Response, NextFunction } from 'express';
import { Payer } from '../../models/payer.model';
import { mockPayCVO } from '../../../utils/brick';

const router = Router();

router.post('/callback', (req, res) => {
    console.debug(req.body);
    res.success({});
});

router.post(
    '/pay/:user_id',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await Payer.query().findById(req.params.user_id);
            if (!user) {
                const err: Error = new Error('User not found');
                res.status(404);
                throw err;
            }
            const updatedUser = await user
                .$query()
                .patchAndFetch({ status: 'paid' });

            await mockPayCVO(updatedUser.cva_id as string);

            res.success({
                user_id: updatedUser.id,
                status: updatedUser.status,
            });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
