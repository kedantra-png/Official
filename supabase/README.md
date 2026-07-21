# OORDHWA — Supabase Database

## Quick start (SQL Editor)

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project → **SQL Editor**
2. Open and run **[`run_all_migrations.sql`](./run_all_migrations.sql)** — this single file creates all tables, functions, triggers, RLS policies, and grants. Safe to run multiple times.

## Migrate via CLI (if installed)

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

## Admin credentials

The admin login at `/admin` verifies credentials against the `admin_users` table using a secure `pgcrypto` hash — no credentials are hardcoded.

**Default admin user** (configured in `run_all_migrations.sql`):
- Email: `oordhwa2026@gmail.com`  
- Password: `aardhwo@2026`

To change the password, run in Supabase SQL Editor:
```sql
UPDATE admin_users SET password_hash = crypt('new-password', gen_salt('bf'))
WHERE email = 'oordhwa2026@gmail.com';
```

## Per-file order (for reference)

To run individually, execute in this order:
1. `migrations/20260523120000_create_contact_inquiries.sql`
2. `migrations/20260523130000_remove_email_from_contact_inquiries.sql` (only if you already created the table **with** an `email` column)
3. `migrations/20260528120000_create_customer_experiences.sql`
4. `migrations/20260620000000_create_admin_users.sql`

## Table: `public.contact_inquiries`

| Column         | Type              | Notes                                    |
|----------------|-------------------|------------------------------------------|
| `id`           | `uuid`            | Primary key, auto-generated              |
| `name`         | `text`            | 2–120 chars, trimmed                     |
| `inquiry_type` | `inquiry_type`    | `feedback` \| `query` \| `complaint`     |
| `message`      | `text`            | 10–5000 chars, trimmed                   |
| `status`       | `inquiry_status`  | `new` (default) \| `read` \| `resolved`  |
| `source`       | `text`            | Default `website`                        |
| `user_agent`   | `text`            | Optional, set by API                       |
| `page_path`    | `text`            | Optional referer/path from API             |
| `created_at`   | `timestamptz`     | Auto                                     |
| `updated_at`   | `timestamptz`     | Auto on update                           |

## Enums

| Type             | Values                              |
|------------------|-------------------------------------|
| `inquiry_type`   | `feedback`, `query`, `complaint`    |
| `inquiry_status` | `new`, `read`, `resolved`           |

## RLS policies

| Policy                                   | Role            | Action | Rule                                           |
|------------------------------------------|-----------------|--------|------------------------------------------------|
| `contact_inquiries_insert_anon`          | `anon`          | INSERT | valid type, `status = new`, `source = website` |
| `contact_inquiries_insert_authenticated` | `authenticated` | INSERT | same as above                                  |

- **No public SELECT** — visitors cannot read submissions.
- **Manage rows** in Dashboard → Table Editor (uses service role), or add an admin SELECT policy later (see commented SQL in the migration).

## App environment

Copy `.env.example` to `.env.local`:

```env
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

Restart `npm run dev` after changing env vars.

## Verify inserts

After submitting the form on the site, open **Table Editor** → `contact_inquiries` and confirm a row with `inquiry_type`, `name`, `message`, and `status = new`.

---

## Table: `public.customer_experiences`

Run migration: `supabase/migrations/20260528120000_create_customer_experiences.sql`

| Column         | Type        | Notes                          |
|----------------|-------------|--------------------------------|
| `id`           | `uuid`      | Primary key                    |
| `quote`        | `text`      | 10–2000 chars                  |
| `author`       | `text`      | 2–120 chars                    |
| `role`         | `text`      | Optional                       |
| `company`      | `text`      | Optional                       |
| `image_url`    | `text`      | Optional https URL             |
| `is_published` | `boolean`   | Default `true`                 |
| `source`       | `text`      | Default `website`              |
| `user_agent`   | `text`      | Optional, set by API           |
| `page_path`    | `text`      | Optional referer/path          |
| `created_at`   | `timestamptz` | Auto                         |
| `updated_at`   | `timestamptz` | Auto on update               |

### RLS

| Policy                                    | Roles            | Action | Rule                          |
|-------------------------------------------|------------------|--------|-------------------------------|
| `customer_experiences_select_public`      | `anon`, `authenticated` | SELECT | `is_published = true`         |
| `customer_experiences_insert_anon`        | `anon`           | INSERT | published + `website` source  |
| `customer_experiences_insert_authenticated` | `authenticated` | INSERT | published + `website` source  |

The **Customer Experiences** section on the site reads via `GET /api/customer-experiences` and inserts via `POST /api/customer-experiences`.

### Data API

If customer_experiences is not visible via the Data API after running migrations, check your project's **Data API Settings** in the dashboard and grant `SELECT`/`INSERT` to the `anon` and `authenticated` roles. The `run_all_migrations.sql` script already includes the required GRANT statements.
