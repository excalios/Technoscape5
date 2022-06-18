import request from 'supertest';
import app from '../src/app';

require('dotenv').config();

describe('Checkhealth', () => {
    it('should respond with a message', done => {
        request(app)
            .get('/checkhealth')
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
                expect(res.body.data.message).toEqual('Negative');
                done();
            });
    });

    it('should respond not found', done => {
        request(app)
            .get('/checkhealth32')
            .expect(404)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) {
                    console.error({ err });
                    console.error({ res });
                    done(err);
                }

                expect(res.body.status).toBe(404);
                expect(res.body.success).toBe(false);
                expect(res.body.data.message).toContain('Not Found');
                done();
            });
    });

    it('should respond with a from database', done => {
        request(app)
            .get('/checkhealth-db')
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
                expect(res.body.data.message).toBe(4);
                done();
            });
    });
});
