import Router from 'express';
// eslint-disable-next-line @typescript-eslint/no-redeclare
import type { Request, Response } from 'express';

const router = Router();

router.post('/calculate', (req: Request, res: Response) => {
    const users: Array<string> = req.body.users;

    // Store each name
    let result = users.map(name => {
        return {
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
        item.payee.forEach((payee: number) => {
            result[payee].items.push({
                name: item.name,
                price: item.total_price / item.payee.length,
            });
        });
    });

    // Calculate prices
    result.forEach(user => {
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
    });

    res.success({
        users: result,
    });
});

export default router;
