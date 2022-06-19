import { Knex } from 'knex';

import tableNames from '../../utils/constants/tableNames';
import { primaryKey } from '../../utils/tables';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(tableNames.transaction, table => {
        primaryKey(knex, table);
        table.string('title');
        table.decimal('tax_price');
        table.decimal('service_charge');
        table.decimal('other_price');
        table.decimal('discount');
        table.decimal('total_price');
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable(tableNames.transaction);
}
