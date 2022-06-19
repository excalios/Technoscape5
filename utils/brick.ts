import axios from 'axios';
import moment from 'moment';

import 'dotenv/config';

const brickAuthorized = axios.create({
    baseURL: process.env.BRICK_URL,
    headers: {
        Authorization: 'Bearer ' + process.env.BRICK_PUBLIC_ACCESS_TOKEN,
    },
});

export async function generateCVA(
    referenceId: string,
    amount: number,
    description: string,
    expiredAt: Date,
    bankShortCode: string,
    displayName: string,
) {
    expiredAt.setHours(expiredAt.getHours() + 1);
    const time = moment(expiredAt).toISOString(true);
    const datetime = time.slice(0, 19) + time.slice(23, 29);
    try {
        const res = await brickAuthorized.post('/payments/close-va', {
            paymentMethodType: 'virtual_bank_account',
            amount,
            referenceId,
            expiredAt: datetime,
            description,
            paymentMethodOptions: {
                bankShortCode,
                displayName,
            },
        });

        return res.data;
    } catch (err) {
        console.error(err);
    }
}

export async function mockPayCVO(cva_id: string) {
    try {
        const res = await brickAuthorized.post(
            '/payments/close-va/status/' + cva_id,
            {
                action: 'paid',
            },
        );

        return res;
    } catch (err) {
        console.error(err);
    }
}
