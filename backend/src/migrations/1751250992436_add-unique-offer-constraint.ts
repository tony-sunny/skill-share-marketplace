import type { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
   pgm.addConstraint("offers", "offers_task_id_provider_id_unique", {
    unique: ["task_id", "provider_id"]
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropConstraint("offers", "offers_task_id_provider_id_unique");
}
