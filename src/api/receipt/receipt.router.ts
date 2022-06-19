import Router from 'express';
// eslint-disable-next-line @typescript-eslint/no-redeclare
import type { Request, Response, NextFunction } from 'express';
import { Transaction } from '../../models/transaction.model';
import { Payer } from '../../models/payer.model';
import { generateCVA } from '../../../utils/brick';

const router = Router();

router.get(
    '/:uuid',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const receipt = await Transaction.query()
                .findById(req.params.uuid)
                .withGraphFetched('payers.items');

            res.success({
                receipt,
            });
        } catch (err) {
            next(err);
        }
    },
);

router.post(
    '/:uuid/pay/:user_id/cva',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const transaction = await Transaction.query().findById(
                req.params.uuid,
            );
            if (!transaction) {
                const err: Error = new Error('Transaction not found');
                res.status(404);
                throw err;
            }

            const user = await Payer.query().findById(req.params.user_id);
            if (!user) {
                const err: Error = new Error('User not found');
                res.status(404);
                throw err;
            }

            const expiredAt = new Date();
            expiredAt.setHours(expiredAt.getHours() + 1);
            const { data: cva } = await generateCVA(
                user.id,
                user.total_price,
                'Pembayaran patungin ' +
                    transaction.title +
                    ' ' +
                    transaction.id,
                expiredAt,
                req.body.bankShortCode,
                `${transaction.title} - ${user.name}`,
            );

            user.va_account =
                cva.attributes.paymentMethod.instructions.accountNo;
            user.status = cva.attributes.status;
            user.destination_account_name = req.body.destination_account_name;
            user.destination_account_number =
                req.body.destination_account_number;
            user.destination_bank_code = req.body.destination_bank_code;
            user.cva_id = cva.id;

            await user.$query().updateAndFetch(user);

            res.success({
                va_account: user.va_account,
                display_name:
                    cva.attributes.paymentMethod.instructions.displayName,
                description: cva.attributes.description,
                destination_account_name: user.destination_account_name,
                destination_account_number: user.destination_account_number,
                destination_bank_code: user.destination_bank_code,
                status: user.status,
                total_price: user.total_price,
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
