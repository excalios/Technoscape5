import Router from 'express';
// eslint-disable-next-line @typescript-eslint/no-redeclare
import type { Request, Response, NextFunction } from 'express';
import { Transaction } from '../../models/transaction.model';
import { Payer } from '../../models/payer.model';

const router = Router();

router.get(
    '/:uuid',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const receipt = await Transaction.query()
                .findById(req.params.uuid)
                .withGraphFetched('payers.items');

            console.debug(receipt);

            res.success({
                receipt,
            });
        } catch (err) {
            next(err);
        }
    },
);

router.post(
    '/calculate',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users: Array<string> = req.body.users;

            const transaction: Transaction = await Transaction.query().insert({
                title: req.body.title,
                tax_price: req.body.tax_price,
                service_charge: req.body.service_charge,
                other_price: req.body.other_price,
                discount: req.body.discount,
                total_price: req.body.total_price,
            });

            // Store each name
            let result = users.map(name => {
                return {
                    id: '',
                    name,
                    items: [] as Array<any>,
                    tax_price: 0,
                    service_charge: 0,
                    other_price: 0,
                    discount: 0,
                    total_price: 0,
                };
            });

            // Push every item to user with according prices
            req.body.items.forEach((item: any) => {
                item.payer.forEach((payer: number) => {
                    result[payer].items.push({
                        name: item.name,
                        price: item.total_price / item.payer.length,
                    });
                });
            });

            // Calculate prices
            for (const user of result) {
                let totalPrice: number = 0;
                user.items.forEach(item => {
                    totalPrice += item.price;
                });
                const percentage = totalPrice / req.body.subtotal;
                user.tax_price = req.body.tax_price * percentage;
                user.service_charge = req.body.service_charge * percentage;
                user.other_price = req.body.other_price * percentage;
                user.discount = req.body.discount * percentage;
                user.total_price =
                    totalPrice +
                    user.tax_price +
                    user.service_charge +
                    user.other_price -
                    user.discount;

                const storedUser: Payer = await Payer.query().insertAndFetch({
                    transaction_id: transaction.id,
                    name: user.name,
                    tax_price: user.tax_price,
                    service_charge: user.service_charge,
                    other_price: user.other_price,
                    discount: user.discount,
                    total_price: user.total_price,
                });
                user.id = storedUser.id;

                for (const item of user.items) {
                    await storedUser.$relatedQuery('items').insert({
                        name: item.name,
                        price: item.price,
                    });
                }
            }

            res.success({
                id: transaction.id,
                title: transaction.title,
                users: result,
            });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
