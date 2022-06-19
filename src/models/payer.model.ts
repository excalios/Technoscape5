import { Model, RelationMappings, RelationMappingsThunk } from 'objection';

import tableNames from '../../utils/constants/tableNames';
import { Item } from './item.model';
import { Transaction } from './transaction.model';

export class Payer extends Model {
    id!: string;

    transaction_id!: string;

    name!: string;

    tax_price!: number;

    service_charge!: number;

    other_price!: number;

    discount!: number;

    total_price!: number;

    destination_account_name?: string;

    destination_account_number?: string;

    destination_bank_code?: string;

    va_account?: string;

    cva_id?: string;

    status?: string;

    static tableName = tableNames.transaction_payer;

    static jsonSchema = {
        type: 'object',
        additionalProperties: false,
        required: [
            'transaction_id',
            'name',
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
            transaction_id: {
                type: 'string',
            },
            name: {
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
            destination_account_name: {
                type: 'string',
            },
            destination_account_number: {
                type: 'string',
            },
            destination_bank_code: {
                type: 'string',
            },
            va_account: {
                type: 'string',
            },
            cva_id: {
                type: 'string',
            },
            status: {
                type: 'string',
                enum: ['pending', 'paid', 'completed', 'expired'],
            },
        },
    };

    static relationMappings: RelationMappings | RelationMappingsThunk = {
        transaction: {
            relation: Model.BelongsToOneRelation,
            modelClass: Transaction,
            join: {
                from: `${tableNames.transaction_payer}.transaction_id`,
                to: `${tableNames.transaction}.id`,
            },
        },
        items: {
            relation: Model.HasManyRelation,
            modelClass: Item,
            join: {
                from: `${tableNames.transaction_payer}.id`,
                to: `${tableNames.payer_item}.payer_id`,
            },
        },
    };
}
