import * as e from 'express';

declare module 'express-serve-static-core' {
    export interface Response {
        success(data: object | Array<any>): this;
        error(status: number, data: object | Array<any>): this;
    }
}
