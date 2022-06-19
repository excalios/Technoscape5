import { Knex } from 'knex';

import tableNames from '../../utils/constants/tableNames';
import { primaryKey } from '../../utils/tables';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(tableNames.payer_item, table => {
        primaryKey(knex, table);
        table
            .uuid('payer_id')
            .references('id')
            .inTable(tableNames.transaction_payer)
            .onDelete('cascade')
            .notNullable();
        table.string('name');
        table.decimal('price');
        table.timestamps(true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable(tableNames.payer_item);
}
