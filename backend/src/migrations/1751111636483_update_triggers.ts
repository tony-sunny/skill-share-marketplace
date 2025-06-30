import type { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE OR REPLACE FUNCTION set_current_timestamp_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  pgm.sql(`
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_current_timestamp_updated_at();
  `);

  pgm.sql(`
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON skills
    FOR EACH ROW
    EXECUTE FUNCTION set_current_timestamp_updated_at();
  `);

  pgm.sql(`
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION set_current_timestamp_updated_at();
  `);

  pgm.sql(`
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON offers
    FOR EACH ROW
    EXECUTE FUNCTION set_current_timestamp_updated_at();
  `);

  pgm.sql(`
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON task_progress
    FOR EACH ROW
    EXECUTE FUNCTION set_current_timestamp_updated_at();
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`DROP TRIGGER IF EXISTS set_updated_at ON users;`);
  pgm.sql(`DROP TRIGGER IF EXISTS set_updated_at ON skills;`);
  pgm.sql(`DROP TRIGGER IF EXISTS set_updated_at ON tasks;`);
  pgm.sql(`DROP TRIGGER IF EXISTS set_updated_at ON offers;`);
  pgm.sql(`DROP TRIGGER IF EXISTS set_updated_at ON task_progress;`);
  pgm.sql(`DROP FUNCTION IF EXISTS set_current_timestamp_updated_at;`);
}
