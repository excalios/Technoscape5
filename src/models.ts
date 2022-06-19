import { Model, RelationMappings, RelationMappingsThunk } from 'objection';

import tableNames from '../utils/constants/tableNames';

export class Transaction extends Model {
    id!: string;

    title!: string;

    tax_price!: number;

    service_charge!: number;

    other_price!: number;

    discount!: number;

    total_price!: number;

    destination_account_name!: string;

    destination_account_number!: string;

    destination_bank_code!: string;

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
            'destination_account_name',
            'destination_account_number',
            'destination_bank_code',
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
            destination_account_name: {
                type: 'string',
            },
            destination_account_number: {
                type: 'string',
            },
            destination_bank_code: {
                type: 'string',
            },
        },
    };

    static relationMappings: RelationMappings | RelationMappingsThunk = {
        payers: {
            relation: Model.HasManyRelation,
            modelClass: 'Payer',
            join: {
                from: `${tableNames.transaction}.id`,
                to: `${tableNames.transaction_payer}.transaction_id`,
            },
        },
    };
}

export class Payer extends Model {
    id!: string;

    name!: string;

    tax_price!: number;

    service_charge!: number;

    other_price!: number;

    discount!: number;

    total_price!: number;

    static tableName = tableNames.transaction_payer;

    static jsonSchema = {
        type: 'object',
        additionalProperties: false,
        required: [
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
    };
}