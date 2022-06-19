import { generateCVA } from '../../utils/brick';
import { randomUUID } from 'crypto';

describe('test brick unit functionality', () => {
    it('should return a generated close va', done => {
        const expiredAt = new Date();
        expiredAt.setHours(expiredAt.getHours() + 1);
        generateCVA(
            randomUUID(),
            100_000,
            'Testing CVA',
            expiredAt,
            'MANDIRI',
            'Testinggg',
        ).then(result => {
            console.info(result);
            expect(result.status).toBe(200);
            done();
        });
    }, 10000);
});
