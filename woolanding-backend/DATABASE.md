# Database Setup Guide

## Quick Setup

### 1. Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Windows:**
Download from: https://www.postgresql.org/download/windows/

### 2. Create Database

**Option A: Using setup script (recommended)**
```bash
cd scripts
./setup-db.sh
```

**Option B: Manual setup**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE woolanding_db;

# Connect to the database
\c woolanding_db

# Run schema
\i scripts/schema.sql

# Exit
\q
```

### 3. Configure .env

```bash
# Copy example
cp .env.example .env

# Edit and set your database credentials
nano .env
```

Update these variables:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=woolanding_db
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### 4. Test Connection

```bash
npm run dev
```

Visit `http://localhost:3000/health` - should show database connection status.

## Database Schema Overview

### Core Tables

- **users** - User accounts
- **plans** - Subscription plans (Free, Starter, Pro, Agency)
- **subscriptions** - User subscriptions linked to Stripe
- **api_keys** - API keys for WordPress plugin
- **generations** - Landing page generation history
- **usage_limits** - Monthly usage tracking
- **payments** - Payment transaction history
- **sessions** - JWT refresh tokens
- **user_settings** - User preferences

### Support Tables

- **webhook_events** - Stripe webhook audit log
- **email_verification_tokens** - Email verification
- **password_reset_tokens** - Password reset tokens

## Common Operations

### View all tables
```sql
\dt
```

### View table structure
```sql
\d users
```

### Check active subscriptions
```sql
SELECT * FROM active_subscriptions_view;
```

### Check user usage
```sql
SELECT * FROM user_usage_stats;
```

### Get database stats
```sql
SELECT
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM subscriptions WHERE status = 'active') as active_subs,
    (SELECT COUNT(*) FROM generations) as total_generations;
```

## Reset Database

⚠️ **Warning: This will delete ALL data!**

```bash
# Drop and recreate
dropdb woolanding_db
createdb woolanding_db
psql -d woolanding_db -f scripts/schema.sql
```

## Backup & Restore

### Backup
```bash
pg_dump woolanding_db > backup.sql
```

### Restore
```bash
psql woolanding_db < backup.sql
```

## Troubleshooting

### Connection refused
- Check if PostgreSQL is running: `pg_isready`
- Check port: `sudo lsof -i :5432`
- Check pg_hba.conf for access rules

### Authentication failed
- Verify password in `.env`
- Check PostgreSQL user: `psql -U postgres -c "\du"`

### Database does not exist
- Create it: `createdb woolanding_db`

### Permission denied
- Grant privileges:
```sql
GRANT ALL PRIVILEGES ON DATABASE woolanding_db TO postgres;
```

## Production Considerations

1. **Use connection pooling** (already implemented in `database.ts`)
2. **Enable SSL** in production
3. **Regular backups** (daily recommended)
4. **Monitor query performance**
5. **Set appropriate max_connections** in postgresql.conf
6. **Use prepared statements** (already implemented)

## Migrations (Future)

For production, we'll implement migrations using Knex.js:

```bash
npm install knex
npx knex init
npx knex migrate:make create_users
npx knex migrate:latest
```
