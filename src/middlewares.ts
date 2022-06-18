// eslint-disable-next-line @typescript-eslint/no-redeclare
import { NextFunction, Request, Response } from 'express';

export function responses(_: Request, res: Response, next: NextFunction) {
    res.success = function (data: object | Array<any>) {
        return res.status(200).json({
            success: true,
            status: 200,
            data,
        });
    };

    res.error = function (status: number, data: object | Array<any>) {
        return res.status(status).json({
            success: false,
            status,
            data,
        });
    };

    next();
}

export function notFound(req: Request, res: Response, next: NextFunction) {
    const error = new Error(`Not Found at ${req.originalUrl}`);
    res.status(404);
    next(error);
}

export function errorHandler(
    error: any,
    _req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction,
) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.error(statusCode, {
        status: statusCode,
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? 'XoX' : error.stack,
        errors: error.errors || error.message || undefined,
    });
}
