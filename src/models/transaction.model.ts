import { Model, RelationMappings, RelationMappingsThunk } from 'objection';

import tableNames from '../../utils/constants/tableNames';
import { Payer } from './payer.model';

export class Transaction extends Model {
    id!: string;

    title!: string;

    tax_price!: number;

    service_charge!: number;

    other_price!: number;

    discount!: number;

    total_price!: number;

    static tableName = tableNames.transaction;

    static jsonSchema = {
        type: 'object',
        additionalProperties: false,
        required: [
            'title',
            'tax_price',
            'service_charge',
            'other_price',
            'discount',
            'total_price',
        ],
        properties: {
            id: {
                type: 'string',
            },
            title: {
                type: 'string',
            },
            tax_price: {
                type: 'number',
            },
            service_charge: {
                type: 'number',
            },
            other_price: {
                type: 'number',
            },
            discount: {
                type: 'number',
            },
            total_price: {
                type: 'number',
            },
        },
    };

    static relationMappings: RelationMappings | RelationMappingsThunk = {
        payers: {
            relation: Model.HasManyRelation,
            modelClass: Payer,
            join: {
                from: `${tableNames.transaction}.id`,
                to: `${tableNames.transaction_payer}.transaction_id`,
            },
        },
    };
}
