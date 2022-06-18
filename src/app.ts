/* eslint-disable @typescript-eslint/no-shadow */
import express from 'express';
// eslint-disable-next-line @typescript-eslint/no-redeclare
import type { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

import { errorHandler, notFound, responses } from './middlewares';

const app = express();

import db from './db';

app.use(compression());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use(responses);

app.get('/checkhealth', (_req: Request, res: Response) => {
    res.success({
        message: 'Negative',
    });
});

app.get(
    '/checkhealth-db',
    async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const message = (await db.raw('select 2 + 2 as result;')).rows[0]
                .result;
            res.success({
                message,
            });
        } catch (err) {
            next(err);
        }
    },
);

app.use(notFound);
app.use(errorHandler);

export default app;