# Database Migrations

This directory contains SQL migration files for updating the database schema.

## Running Migrations

To run all migrations:

```bash
cd backend
node run-migration.js
```

The migration runner will:
1. Connect to the database
2. Execute all `.sql` files in this directory in alphabetical order
3. Skip statements that would create duplicate columns/indexes
4. Log the progress and results

## Migration Files

- `001_add_component_id_to_activities.sql` - Adds component_id column to activities table
- `002_add_activity_date_column.sql` - Adds activity_date column to activities table (fixes ORDER BY error)

## Creating New Migrations

1. Create a new `.sql` file with a numeric prefix (e.g., `003_my_migration.sql`)
2. Use `ADD COLUMN IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS` for idempotency
3. Add comments to explain what the migration does
4. Test the migration before committing

## Error Handling

The migration runner will:
- Continue on duplicate column/index errors (ER_DUP_FIELDNAME, ER_DUP_KEYNAME)
- Stop and report other errors
- Close the database connection when done
