# Railway Deployment Guide

## Quick Deploy

### 1. Napraw błąd buildu

Właśnie dodaliśmy potrzebne pliki:
- ✅ `railway.json` - Railway config
- ✅ `nixpacks.toml` - Build config
- ✅ `Procfile` - Start command
- ✅ `.node-version` - Node.js version

**Commit i push:**
```bash
git add .
git commit -m "fix: add Railway deployment configuration"
git push
```

Railway automatycznie wykryje nowy commit i spróbuje ponownie!

---

### 2. Environment Variables

W Railway Dashboard, ustaw te zmienne:

#### Wymagane:
```bash
NODE_ENV=production
PORT=3000

# JWT (wygeneruj nowe!)
JWT_ACCESS_SECRET=ZMIEŃ_NA_LOSOWY_STRING_MIN_32_ZNAKI
JWT_REFRESH_SECRET=ZMIEŃ_NA_INNY_LOSOWY_STRING_MIN_32_ZNAKI

# Stripe (test mode na początek)
STRIPE_SECRET_KEY=sk_test_twoj_klucz
STRIPE_WEBHOOK_SECRET=whsec_twoj_secret

# OpenAI
OPENAI_API_KEY=sk-twoj_klucz

# SendGrid
SENDGRID_API_KEY=twoj_klucz
EMAIL_FROM=noreply@twojadomene.com

# Frontend (zostaw localhost na razie)
FRONTEND_URL=http://localhost:3001
```

#### Auto-generowane przez Railway:
Railway automatycznie utworzy:
- `DATABASE_URL` - gdy dodasz PostgreSQL
- `REDIS_URL` - gdy dodasz Redis

**Musisz je przekonwertować** w Railway Settings → Variables:

**Dla PostgreSQL** (Railway da ci DATABASE_URL):
```bash
# Railway daje: postgresql://user:pass@host:5432/db
# Musisz dodać osobno:
DB_HOST=postgres.railway.internal
DB_PORT=5432
DB_NAME=railway
DB_USER=postgres
DB_PASSWORD=(z DATABASE_URL)
```

**Dla Redis** (Railway da ci REDIS_URL):
```bash
# Railway daje: redis://default:pass@host:6379
# Musisz dodać:
REDIS_HOST=redis.railway.internal
REDIS_PORT=6379
REDIS_PASSWORD=(z REDIS_URL)
```

---

### 3. Dodaj PostgreSQL do Railway

1. W Railway Dashboard, kliknij **"+ New"**
2. Wybierz **"Database" → "PostgreSQL"**
3. Railway automatycznie:
   - Utworzy bazę danych
   - Połączy z Twoim backendem
   - Ustawi `DATABASE_URL`

4. **Uruchom schema!**

   Railway nie ma GUI do importu SQL, więc zrób to lokalnie:

   ```bash
   # Pobierz DATABASE_URL z Railway
   # W Railway Dashboard → PostgreSQL → Connect → Copy DATABASE_URL

   # Uruchom schema
   psql $DATABASE_URL -f scripts/schema.sql
   ```

   Lub użyj Railway CLI:
   ```bash
   # Zainstaluj Railway CLI
   npm install -g @railway/cli

   # Login
   railway login

   # Link project
   railway link

   # Connect do bazy i uruchom schema
   railway run psql -f scripts/schema.sql
   ```

---

### 4. Dodaj Redis do Railway

1. W Railway Dashboard, kliknij **"+ New"**
2. Wybierz **"Database" → "Redis"**
3. Railway automatycznie ustawi `REDIS_URL`

---

### 5. Sprawdź Deployment

Po commit i push, Railway:
1. ✅ Pobiera kod z GitHub
2. ✅ Instaluje dependencies (`npm ci`)
3. ✅ Buduje TypeScript (`npm run build`)
4. ✅ Startuje serwer (`npm start`)

**Logs:**
- Railway Dashboard → Deployments → View Logs

**Health Check:**
```bash
curl https://twoja-app.railway.app/health
```

Powinieneś zobaczyć:
```json
{
  "status": "ok",
  "timestamp": "2024-12-05T...",
  "uptime": 123,
  "environment": "production",
  "version": "v1"
}
```

---

## Troubleshooting

### Build fails: "Cannot find module"
```bash
# Usuń node_modules i package-lock.json
rm -rf node_modules package-lock.json
git add .
git commit -m "chore: refresh dependencies"
git push
```

### Database connection error
- Sprawdź czy dodałeś PostgreSQL w Railway
- Sprawdź environment variables (DB_HOST, DB_PORT, etc.)
- Użyj Railway internal DNS: `postgres.railway.internal`

### Port error
- Railway automatycznie ustawia `PORT` env variable
- Nasz kod czyta `process.env.PORT` - jest OK!

### Timeout podczas buildu
- Railway ma 10-minutowy limit na build
- Jeśli za długo, sprawdź `package-lock.json` (może być duży)

---

## Custom Domain (opcjonalnie)

1. Railway Dashboard → Settings → Domains
2. Kliknij **"Generate Domain"** (dostaniesz `.railway.app`)
3. Lub dodaj **Custom Domain**:
   - Dodaj `CNAME` record w DNS:
     ```
     api.twojadomene.com → twoja-app.railway.app
     ```
   - Zweryfikuj w Railway

---

## Auto-Deploy z GitHub

Railway już ma auto-deploy!

Każdy `git push` → automatyczny deploy 🎉

Możesz też:
- Wyłączyć auto-deploy (manual trigger only)
- Ustawić deploy tylko z określonej gałęzi
- Deploy previews dla Pull Requests

---

## Monitoring

Railway pokazuje:
- **CPU usage**
- **Memory usage**
- **Network traffic**
- **Deployment logs**

Dla bardziej zaawansowanego:
- Dodaj Sentry (error tracking)
- Dodaj LogRocket (session replay)

---

## Koszty

Railway używa **pay-as-you-go**:

**Starter Plan** ($5/mo included):
- 500 GB-hours compute
- 100 GB bandwidth

**Typowe koszty dla małego API:**
- Backend: $5-10/mo
- PostgreSQL: $5/mo
- Redis: $3/mo

**TOTAL:** ~$13-18/mo na start

---

## Production Checklist

Przed launch:

- [ ] Environment variables ustawione (produkcyjne!)
- [ ] Database schema załadowany
- [ ] Health check działa
- [ ] Stripe w test mode (zmień na live później)
- [ ] OpenAI API key ważny i ma credity
- [ ] Custom domain skonfigurowana (opcjonalnie)
- [ ] Monitoring ustawiony (Sentry)
- [ ] Backupy bazy danych (Railway robi automatycznie)
- [ ] Rate limiting działa
- [ ] Logs sprawdzone

---

## Przydatne komendy Railway CLI

```bash
# Login
railway login

# Link projekt
railway link

# View logs
railway logs

# Run command w Railway environment
railway run npm run migrate

# Connect do bazy
railway connect postgres

# Lista variables
railway variables

# Open dashboard
railway open
```

---

Masz pytania? Sprawdź:
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
