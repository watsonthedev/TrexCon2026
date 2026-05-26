# Database Migrations

SQL migration files for the TrexCon Supabase project.

## Structure

```
supabase/
└── migrations/
    └── YYYYMMDDHHMMSS_description.sql   ← one file per change, applied in order
```

## Applying migrations

### Manual (current approach)
Run each `.sql` file in order in the **Supabase dashboard → SQL Editor**.  
Files are named with a timestamp prefix so they sort in the correct order.

### Supabase CLI (optional upgrade)
If you install the [Supabase CLI](https://supabase.com/docs/guides/cli) later,
this folder structure is already compatible:

```bash
supabase link --project-ref muqkzcminmetvjpyxcqq
supabase db push
```

## Adding a new migration

1. Create a new file: `supabase/migrations/YYYYMMDDHHMMSS_what_changed.sql`
   - Use the current UTC timestamp so it sorts after existing migrations.
2. Write the SQL (always additive — avoid `drop` on existing prod tables).
3. Apply it in the Supabase dashboard, then commit the file.

## Project

- **Supabase project ref:** `muqkzcminmetvjpyxcqq`
- **Region:** check the Supabase dashboard
