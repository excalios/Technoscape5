import request from 'supertest';
import app from '../../../src/app';

require('dotenv').config();

describe('Price Distribute Calculation', () => {
    it('should respond proper distribution', done => {
        request(app)
            .post('/api/v1/receipt/calculate')
            .send({
                users: ['Ravi', 'Edruz', 'Ditya', 'Tasya'],
                items: [
                    {
                        name: 'Ramen 1',
                        total_price: 30_000,
                        payer: [0, 1, 3],
                    },
                    {
                        name: 'Ramen 2',
                        total_price: 30_000,
                        payer: [2],
                    },
                    {
                        name: 'Es Teh',
                        total_price: 40_000,
                        payer: [0, 1, 2, 3],
                    },
                ],
                subtotal: 100_000,
                tax_price: 10_000,
                service_charge: 10_000,
                other_price: 0,
                discount: 15_000,
                total_price: 105_000,
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) {
                    console.error({ err });
                    console.error({ res });
                    done(err);
                }

                expect(res.body.status).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.data.users.length).toBe(4);
                expect(res.body.data.users[0]).toMatchObject({
                    name: 'Ravi',
                    items: [
                        {
                            name: 'Ramen 1',
                            price: 10_000,
                        },
                        {
                            name: 'Es Teh',
                            price: 10_000,
                        },
                    ],
                    tax_price: 2_000,
                    service_charge: 2_000,
                    other_price: 0,
                    discount: 3_000,
                    total_price: 21_000,
                });
                done();
            });
    });
});
