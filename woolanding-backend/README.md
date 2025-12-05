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

## 🔌 API Endpoints (Planowane)

### Health Check
- `GET /health` - Status serwera

### Authentication
- `POST /v1/auth/register` - Rejestracja użytkownika
- `POST /v1/auth/login` - Logowanie
- `POST /v1/auth/refresh` - Odświeżenie tokenu
- `POST /v1/auth/verify-email` - Weryfikacja emaila
- `POST /v1/auth/forgot-password` - Reset hasła

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

```bash
# 1. Utwórz bazę danych
createdb woolanding_db

# 2. Uruchom migracje (TODO: będzie w przyszłości)
npm run migrate

# 3. Opcjonalnie: seed z przykładowymi danymi
npm run seed
```

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

## 📝 TODO

- [ ] Implementacja autoryzacji (JWT)
- [ ] Połączenie z PostgreSQL
- [ ] Redis cache setup
- [ ] Rate limiting middleware
- [ ] API key validation middleware
- [ ] Stripe webhook handler
- [ ] OpenAI integration
- [ ] Email templates
- [ ] Database migrations (Knex.js)
- [ ] Unit tests
- [ ] Integration tests
- [ ] API documentation (Swagger)
- [ ] Docker setup
- [ ] CI/CD pipeline

## 📄 License

MIT

## 👨‍💻 Author

Adrian Dev Web
