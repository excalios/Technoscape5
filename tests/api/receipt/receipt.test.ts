import request from 'supertest';
import app from '../../../src/app';

require('dotenv').config();

describe('Bill Splitter', () => {
    let receiptId: string;
    it('should respond proper distribution', done => {
        request(app)
            .post('/api/v1/receipt/calculate')
            .send({
                title: 'Bukber',
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
                    console.error({ res, body: res.body });
                    done(err);
                }

                expect(res.body.status).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.data.id.length).toBeGreaterThan(0);
                receiptId = res.body.data.id;

                expect(res.body.data.title).toBe('Bukber');
                expect(res.body.data.users.length).toBe(4);
                expect(res.body.data.users[0].id.length).toBeGreaterThan(0);
                expect(res.body.data.users[0]).toMatchObject({
                    id: expect.any(String),
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

    let userId: string;
    it('should respond proper distribution (get)', done => {
        request(app)
            .get(`/api/v1/receipt/${receiptId}`)
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) {
                    console.error({ err });
                    console.error({ res, body: res.body });
                    done(err);
                }

                expect(res.body.status).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.data.receipt.id).toBe(receiptId);
                expect(res.body.data.receipt.title).toBe('Bukber');
                expect(res.body.data.receipt.payers.length).toBeGreaterThan(0);
                expect(
                    res.body.data.receipt.payers[0].items.length,
                ).toBeGreaterThan(0);
                userId = res.body.data.receipt.payers[0].id;
                done();
            });
    });

    it('should respond proper distribution (get)', done => {
        request(app)
            .post(`/api/v1/receipt/${receiptId}/pay/${userId}/cva`)
            .send({
                bankShortCode: 'MANDIRI',
                destination_account_name: 'Edruz',
                destination_account_number: '310015832267',
                destination_bank_code: 'MANDIRI',
            })
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) {
                    console.error({ err });
                    console.error({ res, body: res.body });
                    done(err);
                }

                expect(res.body.status).toBe(200);
                expect(res.body.success).toBe(true);
                expect(res.body.data).toMatchObject({
                    va_account: expect.any(String),
                    display_name: expect.any(String),
                    description: expect.any(String),
                    destination_account_name: 'Edruz',
                    destination_account_number: '310015832267',
                    destination_bank_code: 'MANDIRI',
                    status: 'pending',
                    total_price: '21000.00',
                });
                done();
            });
    }, 10000);
});
