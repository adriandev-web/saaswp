# WooLanding Backend API

Backend API server dla WooLanding AI Generator - SaaS do automatycznego generowania landing pages dla produktów WooCommerce.

## 🚀 Quick Start

### Wymagania

- Node.js >= 20.0.0
- PostgreSQL >= 14
- Redis >= 6.0
- npm >= 9.0.0

### Instalacja

```bash
# 1. Zainstaluj dependencies
npm install

# 2. Skopiuj .env.example do .env
cp .env.example .env

# 3. Edytuj .env i ustaw swoje wartości
nano .env

# 4. Uruchom serwer deweloperski
npm run dev
```

Serwer będzie dostępny na `http://localhost:3000`

### Dostępne komendy

```bash
npm run dev          # Uruchom serwer deweloperski z hot reload
npm run build        # Build do produkcji (TypeScript → JavaScript)
npm start            # Uruchom produkcyjny serwer (wymaga wcześniejszego build)
npm test             # Uruchom testy
npm run test:watch   # Uruchom testy w trybie watch
npm run lint         # Sprawdź kod (ESLint)
npm run lint:fix     # Napraw automatycznie błędy lintingu
```

## 📁 Struktura Projektu

```
woolanding-backend/
├── src/
│   ├── controllers/     # Route handlers
│   ├── services/        # Business logic
│   ├── models/          # Database models
│   ├── middleware/      # Express middleware (auth, validation, etc.)
│   ├── routes/          # Route definitions
│   ├── utils/           # Helper functions
│   ├── types/           # TypeScript types/interfaces
│   └── server.ts        # Main entry point
├── tests/               # Test files
├── scripts/             # Utility scripts (migrations, seeds, etc.)
├── dist/                # Compiled JavaScript (generated)
├── .env.example         # Example environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## 🌐 Frontend Pages

### Login Page
**URL:** `http://localhost:3000/login.html`

Funkcje:
- Formularz logowania
- Formularz rejestracji
- Walidacja hasła (min. 8 znaków, wielkie/małe litery, cyfry)
- Responsywny design
- Obsługa błędów
- Automatyczne przekierowanie po zalogowaniu

### Dashboard
**URL:** `http://localhost:3000/dashboard.html`

Funkcje:
- Wyświetlanie profilu użytkownika
- Informacje o koncie
- Statystyki (placeholder)
- Automatyczne odświeżanie tokenów
- Funkcja wylogowania

**Uwaga:** Dashboard wymaga autoryzacji - zostaniesz przekierowany do logowania jeśli nie jesteś zalogowany.

## 🔌 API Endpoints

### Health Check
- `GET /health` - Status serwera

### Authentication (✅ Zaimplementowane)
- `POST /v1/auth/register` - Rejestracja użytkownika
- `POST /v1/auth/login` - Logowanie
- `GET /v1/auth/me` - Pobierz profil zalogowanego użytkownika (wymaga auth)
- `POST /v1/auth/refresh` - Odświeżenie tokenu
- `POST /v1/auth/logout` - Wylogowanie (wymaga auth)
- `PUT /v1/auth/change-password` - Zmiana hasła (wymaga auth)

### Authentication (Planowane)
- `POST /v1/auth/verify-email` - Weryfikacja emaila
- `POST /v1/auth/forgot-password` - Reset hasła
- `POST /v1/auth/reset-password` - Ustaw nowe hasło

### API Keys
- `GET /v1/api-keys` - Lista kluczy API
- `POST /v1/api-keys` - Utworzenie nowego klucza
- `DELETE /v1/api-keys/:id` - Usunięcie klucza

### Landing Page Generation
- `POST /v1/generate/landing-page` - Główny endpoint generowania

### Subscription
- `GET /v1/subscription` - Aktywna subskrypcja
- `POST /v1/subscription/checkout` - Rozpocznij checkout
- `POST /v1/subscription/cancel` - Anuluj subskrypcję

### User
- `GET /v1/user/profile` - Profil użytkownika
- `PATCH /v1/user/profile` - Aktualizacja profilu

## 🔐 Zmienne Środowiskowe

Wszystkie wymagane zmienne są w `.env.example`. Najważniejsze:

```bash
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_NAME=woolanding_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_ACCESS_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_secret_here

# Stripe
STRIPE_SECRET_KEY=sk_test_...

# OpenAI
OPENAI_API_KEY=sk-...
```

## 🗄️ Database Setup

### Opcja A: Lokalna baza PostgreSQL

```bash
# 1. Utwórz bazę danych
createdb woolanding_db

# 2. Załaduj schemat
psql woolanding_db < scripts/schema.sql

# 3. Sprawdź czy tabele zostały utworzone
psql woolanding_db -c "\dt"
```

### Opcja B: Railway (Produkcja)

```bash
# 1. Zainstaluj Railway CLI
npm install -g @railway/cli

# 2. Zaloguj się
railway login

# 3. Załaduj schemat
./load-schema.sh

# Lub ręcznie przez Railway Dashboard:
# - Otwórz serwis PostgreSQL w Railway
# - Przejdź do zakładki "Query"
# - Wklej zawartość scripts/schema.sql
# - Kliknij "Run"
```

## 🧪 Testowanie API z cURL

### Rejestracja nowego użytkownika:
```bash
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234",
    "name": "Test User",
    "companyName": "Test Company"
  }'
```

### Logowanie:
```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

Zapisz `accessToken` z odpowiedzi, następnie:

### Pobierz profil użytkownika:
```bash
curl http://localhost:3000/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Zmień hasło:
```bash
curl -X PUT http://localhost:3000/v1/auth/change-password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "Test1234",
    "newPassword": "NewPass123"
  }'
```

### Odśwież token:
```bash
curl -X POST http://localhost:3000/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## 🔒 Wymagania Hasła

- Minimum 8 znaków
- Przynajmniej jedna wielka litera
- Przynajmniej jedna mała litera
- Przynajmniej jedna cyfra

## 🧪 Testing

```bash
# Uruchom wszystkie testy
npm test

# Testy z coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 📦 Deployment

### Build

```bash
npm run build
```

### Start (Production)

```bash
NODE_ENV=production npm start
```

### Docker (TODO)

```bash
docker build -t woolanding-api .
docker run -p 3000:3000 woolanding-api
```

## 🔧 Development

### Dodawanie nowego endpointa

1. Utwórz route w `src/routes/`
2. Utwórz controller w `src/controllers/`
3. Dodaj business logic w `src/services/`
4. Zarejestruj route w `src/server.ts`

### Code Style

Projekt używa:
- TypeScript strict mode
- ESLint + Prettier
- Konwencje nazewnictwa: camelCase dla zmiennych, PascalCase dla klas

## 📚 Tech Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (via `pg`)
- **Cache**: Redis
- **Auth**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: Helmet, bcrypt
- **Payments**: Stripe
- **AI**: OpenAI API
- **Email**: Nodemailer + SendGrid

## 🐛 Troubleshooting

### ✅ "Route GET /login not found" - NAPRAWIONE!

Ten błąd występował wcześniej, ale został naprawiony. System teraz zawiera:
- ✅ Auth routes zamontowane pod `/v1/auth/*`
- ✅ Pliki statyczne serwowane z `/public`
- ✅ Root redirect z `/` do `/login.html`
- ✅ Kompletny system autoryzacji z JWT

Jeśli nadal widzisz ten błąd:
1. Upewnij się że serwer jest uruchomiony
2. Wejdź na `http://localhost:3000/login.html` (z .html)
3. Sprawdź czy wszystkie pliki są zaktualizowane (`git pull`)

### Port already in use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### Database connection error
- Sprawdź czy PostgreSQL działa: `pg_isready`
- Sprawdź credentials w `.env`
- Sprawdź czy baza istnieje: `psql -l`
- Sprawdź czy schemat jest załadowany: `psql woolanding_db -c "\dt"`

### JWT Token Issues
- Upewnij się że `JWT_ACCESS_SECRET` i `JWT_REFRESH_SECRET` są ustawione w `.env`
- Tokeny wygasają po 15 minutach (access) lub 7 dniach (refresh)
- Użyj endpointu `/v1/auth/refresh` aby uzyskać nowe tokeny

## ✅ Completed Features

- [x] **Implementacja autoryzacji (JWT)** - Pełny system z access/refresh tokens
- [x] **Połączenie z PostgreSQL** - Z connection pooling
- [x] **Login/Register pages** - Responsywne strony HTML z walidacją
- [x] **Dashboard** - Panel użytkownika z profilem
- [x] **Database schema** - Kompletny schemat z triggerami i views
- [x] **Password hashing** - bcrypt z 10 salt rounds
- [x] **Protected routes** - Middleware do autoryzacji
- [x] **Token refresh** - Automatyczne odświeżanie tokenów

## 📝 TODO

- [ ] Redis cache setup
- [ ] Rate limiting middleware
- [ ] API key validation middleware
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Stripe webhook handler
- [ ] OpenAI integration
- [ ] Email templates
- [ ] Usage tracking
- [ ] Landing page generation endpoint
- [ ] Unit tests
- [ ] Integration tests
- [ ] API documentation (Swagger)
- [ ] Docker setup
- [ ] CI/CD pipeline

## 📄 License

MIT

## 👨‍💻 Author

Adrian Dev Web
