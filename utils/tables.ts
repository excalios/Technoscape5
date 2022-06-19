import { Knex } from 'knex';

export function primaryKey(knex: Knex, table: Knex.TableBuilder) {
    return table
        .uuid('id')
        .primary()
        .index()
        .unique()
        .notNullable()
        .defaultTo(knex.raw('gen_random_uuid()'));
}
