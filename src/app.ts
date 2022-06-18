/* eslint-disable @typescript-eslint/no-shadow */
import express from 'express';
// eslint-disable-next-line @typescript-eslint/no-redeclare
import type { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';

import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import { errorHandler, notFound, responses } from './middlewares';

const app = express();

import db from './db';

app.use(cors());
app.use(compression());

// Fix swagger docs white screen
const cspDefaults = helmet.contentSecurityPolicy.getDefaultDirectives();
delete cspDefaults['upgrade-insecure-requests'];

app.use(
    helmet({
        contentSecurityPolicy: { directives: cspDefaults },
    }),
);
app.use(morgan('dev'));
app.use(express.json());

const swaggerDocument = YAML.load('src/openapi.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
