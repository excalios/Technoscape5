import { Model, RelationMappings, RelationMappingsThunk } from 'objection';

import tableNames from '../../utils/constants/tableNames';
import { Payer } from './payer.model';

export class Item extends Model {
    id!: string;

    name!: string;

    price!: number;

    static tableName = tableNames.payer_item;

    static jsonSchema = {
        type: 'object',
        additionalProperties: false,
        required: ['name', 'price'],
        properties: {
            id: {
                type: 'string',
            },
            name: {
                type: 'string',
            },
            price: {
                type: 'number',
            },
        },
    };

    static relationMappings: RelationMappings | RelationMappingsThunk = {
        payer: {
            relation: Model.BelongsToOneRelation,
            modelClass: Payer,
            join: {
                from: `${tableNames.payer_item}.payer_id`,
                to: `${tableNames.transaction_payer}.id`,
            },
        },
    };
}
