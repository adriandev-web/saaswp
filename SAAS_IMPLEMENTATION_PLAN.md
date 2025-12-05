# Plan Wdrożenia SaaS dla WooLanding AI Generator

## 📋 Spis Treści

1. [Przegląd Projektu](#przegląd-projektu)
2. [Architektura Systemu](#architektura-systemu)
3. [Stack Technologiczny](#stack-technologiczny)
4. [Struktura Bazy Danych](#struktura-bazy-danych)
5. [API Endpoints](#api-endpoints)
6. [System Autoryzacji](#system-autoryzacji)
7. [System Płatności](#system-płatności)
8. [Panel Administracyjny](#panel-administracyjny)
9. [Modyfikacja Wtyczki WordPress](#modyfikacja-wtyczki-wordpress)
10. [Bezpieczeństwo](#bezpieczeństwo)
11. [Deployment i Hosting](#deployment-i-hosting)
12. [Etapy Wdrożenia](#etapy-wdrożenia)
13. [Kosztorys](#kosztorys)
14. [Timeline](#timeline)

---

## Przegląd Projektu

### Obecny Stan (MVP)
- ✅ Wtyczka WordPress działająca lokalnie
- ✅ Mockowy serwis AI
- ✅ Brak systemu licencji
- ✅ Brak ograniczeń użytkowania

### Docelowy Stan (SaaS)
- 🎯 Panel SaaS na oddzielnym serwerze
- 🎯 System rejestracji i autoryzacji użytkowników
- 🎯 Płatne plany subskrypcyjne (Stripe/PayPal)
- 🎯 API do komunikacji wtyczka ↔ serwer
- 🎯 Prawdziwe API AI (OpenAI/Claude)
- 🎯 Limitowanie użycia według planu
- 🎯 Dashboard z analityką
- 🎯 System API keys
- 🎯 Webhook do zarządzania licencjami

### Model Biznesowy

**Plany subskrypcyjne:**

| Plan | Cena/miesiąc | Landing pages/miesiąc | Funkcje |
|------|--------------|----------------------|---------|
| **Free** | 0 PLN | 3 | Podstawowe szablony, mockowe AI |
| **Starter** | 49 PLN | 50 | Prawdziwe AI, 3 szablony, analytics |
| **Professional** | 149 PLN | 200 | Wszystkie szablony, A/B testing, priority support |
| **Agency** | 499 PLN | 1000 | White-label, bulk generation, API access |

---

## Architektura Systemu

### Diagram High-Level

```
┌─────────────────────────────────────────────────────────────┐
│                     KLIENT (WordPress)                       │
│  ┌────────────────────────────────────────────────────┐     │
│  │         WooLanding AI Generator Plugin              │     │
│  │  - UI w Admin Panel                                 │     │
│  │  - Walidacja API Key                                │     │
│  │  - Komunikacja z API                                │     │
│  └──────────────────┬──────────────────────────────────┘     │
└─────────────────────┼──────────────────────────────────────┘
                      │ HTTPS + API Key
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              SERWER SaaS (Twój Hosting)                      │
│  ┌──────────────────────────────────────────────────┐       │
│  │              API Gateway / Load Balancer          │       │
│  └────────────────┬─────────────────────────────────┘       │
│                   │                                          │
│  ┌────────────────┴─────────────────────────────────┐       │
│  │           Backend API (Node.js/Laravel)           │       │
│  │  - REST API endpoints                             │       │
│  │  - Autoryzacja JWT + API Keys                     │       │
│  │  - Logika biznesowa                               │       │
│  │  - Limitowanie rate limiting                      │       │
│  │  - Integracja z OpenAI/Claude                     │       │
│  └────────┬─────────────────────┬────────────────────┘       │
│           │                     │                            │
│  ┌────────▼─────────┐  ┌────────▼──────────┐                │
│  │   PostgreSQL/     │  │   Redis Cache     │                │
│  │   MySQL Database  │  │   (Sessions,      │                │
│  │                   │  │    Rate Limits)   │                │
│  └───────────────────┘  └───────────────────┘                │
│                                                               │
│  ┌────────────────────────────────────────────────────┐      │
│  │         Frontend Dashboard (React/Vue)             │      │
│  │  - Panel klienta (dashboard)                       │      │
│  │  - Zarządzanie kontem                              │      │
│  │  - Historia generowań                              │      │
│  │  - Analityka                                       │      │
│  │  - Zarządzanie płatnościami                        │      │
│  └────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
                      │
                      │ Webhook
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Zewnętrzne Serwisy                        │
│  - Stripe (płatności)                                        │
│  - OpenAI/Anthropic (AI)                                     │
│  - SendGrid/Mailgun (email)                                  │
│  - Sentry (monitoring błędów)                                │
└─────────────────────────────────────────────────────────────┘
```

### Przepływ danych

**1. Rejestracja i aktywacja:**
```
User → Dashboard → Rejestracja → Email weryfikacyjny →
→ Wybór planu → Stripe Checkout → Webhook → Aktywacja konta →
→ Generowanie API Key → User kopiuje API Key
```

**2. Konfiguracja wtyczki:**
```
WordPress Admin → WooLanding Settings → Wklej API Key →
→ Wtyczka weryfikuje key → Pobiera info o planie → Gotowe
```

**3. Generowanie landing page:**
```
Click "Generate" → Wtyczka wysyła request (API Key + product data) →
→ API weryfikuje key + sprawdza limit → Wywołuje OpenAI →
→ Generuje content → Zwraca JSON → Wtyczka tworzy stronę →
→ API aktualizuje licznik użyć
```

---

## Stack Technologiczny

### Backend API

**Opcja A: Node.js + Express (Zalecana)**
- **Framework**: Express.js / NestJS
- **Język**: TypeScript
- **Zalety**: Szybki, nowoczesny, dobra integracja z AI APIs
- **Struktura**:
  ```
  backend/
  ├── src/
  │   ├── controllers/
  │   ├── services/
  │   ├── models/
  │   ├── middleware/
  │   ├── routes/
  │   └── utils/
  ├── tests/
  ├── package.json
  └── tsconfig.json
  ```

**Opcja B: Laravel (PHP)**
- **Framework**: Laravel 10+
- **Zalety**: Znany ekosystem, łatwa integracja z WordPress
- **Wady**: Wolniejszy niż Node.js

### Frontend Dashboard

**React + Next.js (Zalecane)**
- **Framework**: Next.js 14 (App Router)
- **UI Library**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand / Redux Toolkit
- **API Client**: Axios / TanStack Query
- **Charts**: Recharts / Chart.js
- **Struktura**:
  ```
  frontend/
  ├── app/
  │   ├── (auth)/
  │   │   ├── login/
  │   │   ├── register/
  │   │   └── verify/
  │   ├── (dashboard)/
  │   │   ├── overview/
  │   │   ├── api-keys/
  │   │   ├── billing/
  │   │   └── settings/
  │   └── api/
  ├── components/
  ├── lib/
  └── public/
  ```

**Alternatywa: Vue.js + Nuxt**
- Podobna funkcjonalność
- Mniejsza krzywa uczenia

### Baza Danych

**PostgreSQL (Zalecana)**
- Obsługa JSON
- Bardziej zaawansowane funkcje
- Lepsza wydajność przy dużej skali

**MySQL/MariaDB**
- Popularna, łatwa w setupie
- Dobra dla mniejszych projektów

### Cache i Kolejki

**Redis**
- Session storage
- Rate limiting
- Cache dla zapytań AI
- Kolejki jobów

### AI Provider

**OpenAI API**
- Model: GPT-4-turbo lub GPT-3.5-turbo
- Endpoint: Chat Completions
- Średni koszt: ~$0.01 - $0.03 za landing page

**Anthropic Claude**
- Alternatywa dla OpenAI
- Często lepsze wyniki dla copywritingu

### Płatności

**Stripe**
- Subskrypcje recurring
- Webhook do zarządzania statusem
- Customer Portal

**PayPal** (opcjonalnie)
- Jako alternatywa

### Email

**SendGrid / Mailgun**
- Transakcyjne emaile
- Weryfikacja konta
- Przypomnienia o płatnościach

### Monitoring

**Sentry**
- Error tracking
- Performance monitoring

**LogRocket / Clarity**
- Session replay
- User analytics

---

## Struktura Bazy Danych

### Schema SQL (PostgreSQL)

```sql
-- Tabela użytkowników
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    company_name VARCHAR(255),
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active', -- active, suspended, cancelled
    avatar_url TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC'
);

-- Tabela planów subskrypcyjnych
CREATE TABLE plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2) NOT NULL,
    price_yearly DECIMAL(10,2),
    generation_limit INT NOT NULL, -- ile landing pages/miesiąc
    features JSONB, -- {"templates": 5, "ai_calls": 100, "analytics": true}
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Przykładowe plany
INSERT INTO plans (name, slug, price_monthly, price_yearly, generation_limit, features) VALUES
('Free', 'free', 0, 0, 3, '{"templates": 1, "ai": "mock", "support": "community"}'),
('Starter', 'starter', 49, 470, 50, '{"templates": 3, "ai": "gpt-3.5", "support": "email"}'),
('Professional', 'professional', 149, 1430, 200, '{"templates": 10, "ai": "gpt-4", "ab_testing": true, "support": "priority"}'),
('Agency', 'agency', 499, 4790, 1000, '{"templates": "unlimited", "ai": "gpt-4", "white_label": true, "api_access": true, "support": "dedicated"}');

-- Tabela subskrypcji
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id INT NOT NULL REFERENCES plans(id),
    stripe_subscription_id VARCHAR(255) UNIQUE,
    stripe_customer_id VARCHAR(255),
    status VARCHAR(50) NOT NULL, -- active, cancelled, past_due, trialing
    current_period_start TIMESTAMP,
    current_period_end TIMESTAMP,
    cancel_at_period_end BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela API Keys
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    key_hash VARCHAR(255) UNIQUE NOT NULL, -- hashed API key
    key_prefix VARCHAR(20) NOT NULL, -- pierwsze 8 znaków do wyświetlania
    name VARCHAR(255), -- nazwa nadana przez usera, np "Production Site"
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP, -- opcjonalnie
    is_active BOOLEAN DEFAULT true,
    website_url TEXT, -- opcjonalnie: gdzie jest używany

    -- Metadane
    total_requests INT DEFAULT 0,
    last_ip_address INET
);

-- Tabela generowań (historia)
CREATE TABLE generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,

    -- Dane produktu
    product_id VARCHAR(100), -- ID produktu z WooCommerce
    product_name VARCHAR(255),
    product_data JSONB, -- pełne dane produktu

    -- Wygenerowana zawartość
    ai_response JSONB, -- odpowiedź z AI
    template_used VARCHAR(100),

    -- Metadane
    wordpress_page_id VARCHAR(100), -- ID strony utworzonej w WordPress
    status VARCHAR(50) DEFAULT 'success', -- success, failed, pending
    error_message TEXT,

    -- Timing i koszty
    processing_time_ms INT,
    ai_tokens_used INT,
    estimated_cost DECIMAL(10,4),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Indexy dla szybkiego wyszukiwania
    INDEX idx_user_created (user_id, created_at DESC),
    INDEX idx_api_key (api_key_id)
);

-- Tabela limitów użycia (miesięczne liczniki)
CREATE TABLE usage_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,

    generations_count INT DEFAULT 0,
    generations_limit INT NOT NULL,

    ai_tokens_used INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (user_id, period_start)
);

-- Tabela płatności (historia transakcji)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),

    stripe_payment_id VARCHAR(255) UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'PLN',
    status VARCHAR(50) NOT NULL, -- succeeded, failed, pending, refunded

    payment_method VARCHAR(50), -- card, paypal, etc
    invoice_url TEXT,
    receipt_url TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela webhooków (audit log)
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL, -- stripe, paypal
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela sesji (dla JWT refresh tokens)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) UNIQUE NOT NULL,
    user_agent TEXT,
    ip_address INET,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_refresh_token (refresh_token_hash),
    INDEX idx_user_sessions (user_id, expires_at)
);

-- Tabela ustawień użytkownika
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

    -- Preferencje
    default_template VARCHAR(100),
    ai_tone VARCHAR(50), -- professional, casual, enthusiastic
    language VARCHAR(10) DEFAULT 'en',

    -- Notyfikacje
    email_notifications BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,

    settings_json JSONB, -- dodatkowe ustawienia jako JSON

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Funkcja automatycznej aktualizacji updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggery dla auto-update
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_limits_updated_at BEFORE UPDATE ON usage_limits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Relacje między tabelami

```
users (1) ──┬── (N) subscriptions
            ├── (N) api_keys
            ├── (N) generations
            ├── (N) payments
            └── (1) user_settings

plans (1) ──── (N) subscriptions

api_keys (1) ──── (N) generations
```

---

## API Endpoints

### Dokumentacja API (REST)

**Base URL**: `https://api.woolanding.com/v1`

#### 1. Autoryzacja

```typescript
// POST /auth/register
{
  email: string;
  password: string;
  name: string;
  company_name?: string;
}
Response: {
  user: User;
  message: "Verification email sent"
}

// POST /auth/login
{
  email: string;
  password: string;
}
Response: {
  access_token: string;
  refresh_token: string;
  user: User;
}

// POST /auth/refresh
{
  refresh_token: string;
}
Response: {
  access_token: string;
}

// POST /auth/verify-email
{
  token: string;
}

// POST /auth/forgot-password
{
  email: string;
}

// POST /auth/reset-password
{
  token: string;
  password: string;
}
```

#### 2. API Keys Management

```typescript
// GET /api-keys
// Headers: Authorization: Bearer {access_token}
Response: {
  api_keys: ApiKey[];
}

// POST /api-keys
{
  name: string;
  website_url?: string;
}
Response: {
  api_key: string; // Pokazywane TYLKO raz!
  key_prefix: string;
  created_at: string;
}

// DELETE /api-keys/:id
Response: { success: true }

// GET /api-keys/:id/stats
Response: {
  total_requests: number;
  last_used_at: string;
  generations_this_month: number;
}
```

#### 3. Landing Page Generation (Główny endpoint)

```typescript
// POST /generate/landing-page
// Headers: X-API-Key: {api_key}
{
  product: {
    id: string;
    name: string;
    price: number;
    sale_price?: number;
    image_url?: string;
    description?: string;
    short_description?: string;
    category?: string;
    sku?: string;
  };
  options?: {
    template?: string;
    tone?: 'professional' | 'casual' | 'enthusiastic';
    language?: string;
  };
}

Response: {
  generation_id: string;
  content: {
    headline: string;
    subheadline: string;
    benefits: string[];
    cta_text: string;
    testimonial: {
      quote: string;
      author: string;
    };
    html_template: string; // pełny HTML
  };
  usage: {
    generations_used: number;
    generations_remaining: number;
    reset_date: string;
  };
  metadata: {
    processing_time_ms: number;
    tokens_used: number;
  };
}

// Kody błędów:
// 401 - Invalid API key
// 403 - Subscription expired or limit reached
// 422 - Invalid product data
// 429 - Rate limit exceeded
// 500 - Server error
```

#### 4. Subscription Management

```typescript
// GET /subscription
Response: {
  subscription: Subscription;
  plan: Plan;
  usage: Usage;
}

// POST /subscription/checkout
{
  plan_id: number;
  billing_period: 'monthly' | 'yearly';
}
Response: {
  checkout_url: string; // Stripe Checkout URL
}

// POST /subscription/cancel
Response: {
  subscription: Subscription; // z cancel_at_period_end = true
}

// POST /subscription/reactivate
Response: {
  subscription: Subscription;
}

// GET /subscription/portal
// Zwraca Stripe Customer Portal URL
Response: {
  portal_url: string;
}
```

#### 5. Usage & Analytics

```typescript
// GET /usage/current
Response: {
  period_start: string;
  period_end: string;
  generations_used: number;
  generations_limit: number;
  percentage_used: number;
}

// GET /generations
// Query params: ?page=1&limit=20&from=2024-01-01&to=2024-12-31
Response: {
  generations: Generation[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

// GET /generations/:id
Response: {
  generation: Generation;
}

// GET /analytics/overview
Response: {
  total_generations: number;
  avg_processing_time: number;
  most_used_template: string;
  generations_by_day: Array<{date: string, count: number}>;
  success_rate: number;
}
```

#### 6. User Management

```typescript
// GET /user/profile
Response: {
  user: User;
}

// PATCH /user/profile
{
  name?: string;
  company_name?: string;
  avatar_url?: string;
  timezone?: string;
}

// PATCH /user/settings
{
  default_template?: string;
  ai_tone?: string;
  email_notifications?: boolean;
}

// DELETE /user/account
{
  password: string;
}
```

#### 7. Webhooks (dla Stripe)

```typescript
// POST /webhooks/stripe
// Obsługuje eventy:
// - customer.subscription.created
// - customer.subscription.updated
// - customer.subscription.deleted
// - invoice.payment_succeeded
// - invoice.payment_failed
```

#### 8. Templates

```typescript
// GET /templates
Response: {
  templates: Array<{
    id: string;
    name: string;
    description: string;
    preview_url: string;
    required_plan: string;
  }>;
}

// GET /templates/:id/preview
Response: {
  html: string; // Preview HTML
}
```

---

## System Autoryzacji

### 1. Rejestracja i Weryfikacja

**Flow:**
```
1. User wypełnia formularz rejestracji
2. Backend:
   - Waliduje dane
   - Hashuje hasło (bcrypt, cost=12)
   - Tworzy rekord w DB
   - Generuje token weryfikacyjny (JWT, expires 24h)
   - Wysyła email z linkiem
3. User klika link weryfikacyjny
4. Backend aktualizuje email_verified_at
5. User może się zalogować
```

**Email Template:**
```html
Witaj {name}!

Kliknij poniższy link aby zweryfikować swoje konto:
{verification_link}

Link wygasa za 24 godziny.
```

### 2. Logowanie (JWT)

**Tokens:**
- **Access Token**: Krótki (15 min), JWT, używany do API requests
- **Refresh Token**: Długi (7 dni), stored in DB, używany do odnowienia

**JWT Payload (Access Token):**
```json
{
  "sub": "user_uuid",
  "email": "user@example.com",
  "plan": "starter",
  "iat": 1234567890,
  "exp": 1234568790
}
```

**Logowanie:**
```typescript
// 1. Sprawdź credentials
const user = await findByEmail(email);
const valid = await bcrypt.compare(password, user.password_hash);

// 2. Generuj tokeny
const accessToken = jwt.sign(payload, SECRET, { expiresIn: '15m' });
const refreshToken = crypto.randomBytes(64).toString('hex');

// 3. Zapisz refresh token w DB (hashed)
await saveSession(user.id, hash(refreshToken), userAgent, ip);

// 4. Zwróć tokeny
return { access_token, refresh_token, user };
```

### 3. API Keys dla Wtyczki

**Format klucza:**
```
wlag_live_1234567890abcdefghijklmnopqrstuvwxyz
│    │    │
│    │    └─ Random 32 znaki
│    └─ Environment (live/test)
└─ Prefix (wlag = WooLanding AI Generator)
```

**Generowanie:**
```typescript
function generateApiKey(): { key: string; hash: string; prefix: string } {
  const randomPart = crypto.randomBytes(32).toString('hex');
  const key = `wlag_live_${randomPart}`;
  const hash = await bcrypt.hash(key, 12);
  const prefix = key.substring(0, 16); // "wlag_live_123456"

  return { key, hash, prefix };
}
```

**Walidacja w middleware:**
```typescript
async function validateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'API key required' });
  }

  // Znajdź klucz w DB (szukaj po prefix dla optymalizacji)
  const prefix = apiKey.substring(0, 16);
  const storedKeys = await db.query(
    'SELECT * FROM api_keys WHERE key_prefix = $1 AND is_active = true',
    [prefix]
  );

  // Sprawdź hash
  for (const storedKey of storedKeys) {
    if (await bcrypt.compare(apiKey, storedKey.key_hash)) {
      // Klucz valid, pobierz usera i subskrypcję
      const user = await getUser(storedKey.user_id);
      const subscription = await getActiveSubscription(user.id);

      if (!subscription || subscription.status !== 'active') {
        return res.status(403).json({
          error: 'Subscription expired or inactive'
        });
      }

      // Sprawdź limity
      const usage = await getUsage(user.id);
      if (usage.generations_count >= usage.generations_limit) {
        return res.status(403).json({
          error: 'Monthly limit reached',
          limit: usage.generations_limit,
          reset_date: usage.period_end
        });
      }

      // Aktualizuj last_used_at i total_requests
      await updateApiKeyUsage(storedKey.id, req.ip);

      // Dodaj dane do requesta
      req.user = user;
      req.subscription = subscription;
      req.apiKey = storedKey;

      return next();
    }
  }

  return res.status(401).json({ error: 'Invalid API key' });
}
```

### 4. Rate Limiting

**Implementacja z Redis:**
```typescript
// Limity według planu
const RATE_LIMITS = {
  free: { requests: 10, window: 60 }, // 10 req/min
  starter: { requests: 30, window: 60 },
  professional: { requests: 60, window: 60 },
  agency: { requests: 120, window: 60 }
};

async function rateLimitMiddleware(req, res, next) {
  const userId = req.user.id;
  const plan = req.subscription.plan.slug;
  const limit = RATE_LIMITS[plan];

  const key = `ratelimit:${userId}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, limit.window);
  }

  if (current > limit.requests) {
    const ttl = await redis.ttl(key);
    return res.status(429).json({
      error: 'Rate limit exceeded',
      retry_after: ttl
    });
  }

  res.setHeader('X-RateLimit-Limit', limit.requests);
  res.setHeader('X-RateLimit-Remaining', limit.requests - current);

  next();
}
```

---

## System Płatności

### Integracja ze Stripe

#### 1. Konfiguracja

**Webhooks do zarejestrowania w Stripe:**
```
https://api.woolanding.com/v1/webhooks/stripe
```

**Eventy do subskrybowania:**
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `customer.subscription.trial_will_end`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `payment_intent.succeeded`

#### 2. Proces subskrypcji

**Krok 1: Tworzenie sesji checkout**
```typescript
// POST /subscription/checkout
async function createCheckoutSession(userId: string, planId: number, billingPeriod: string) {
  const user = await getUser(userId);
  const plan = await getPlan(planId);

  // Utwórz lub pobierz Stripe Customer
  let stripeCustomerId = user.stripe_customer_id;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { user_id: userId }
    });
    stripeCustomerId = customer.id;
    await updateUser(userId, { stripe_customer_id: stripeCustomerId });
  }

  // Utwórz sesję checkout
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [{
      price: billingPeriod === 'yearly'
        ? plan.stripe_price_id_yearly
        : plan.stripe_price_id_monthly,
      quantity: 1,
    }],
    success_url: `${FRONTEND_URL}/dashboard/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${FRONTEND_URL}/dashboard/billing`,
    metadata: {
      user_id: userId,
      plan_id: planId
    }
  });

  return { checkout_url: session.url };
}
```

**Krok 2: Obsługa webhooka po udanej płatności**
```typescript
// POST /webhooks/stripe
async function handleStripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    STRIPE_WEBHOOK_SECRET
  );

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      const subscription = event.data.object;
      await upsertSubscription({
        user_id: subscription.metadata.user_id,
        plan_id: subscription.metadata.plan_id,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000),
        current_period_end: new Date(subscription.current_period_end * 1000)
      });

      // Zresetuj licznik użycia na nowy okres
      await resetUsageCounter(subscription.metadata.user_id);
      break;

    case 'customer.subscription.deleted':
      await cancelSubscription(event.data.object.id);
      break;

    case 'invoice.payment_failed':
      await handlePaymentFailed(event.data.object);
      // Wyślij email z przypomnieniem
      await sendPaymentFailedEmail(event.data.object.customer_email);
      break;
  }

  res.json({ received: true });
}
```

#### 3. Customer Portal

```typescript
// GET /subscription/portal
async function getCustomerPortal(userId: string) {
  const user = await getUser(userId);

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripe_customer_id,
    return_url: `${FRONTEND_URL}/dashboard/billing`
  });

  return { portal_url: session.url };
}
```

**Portal pozwala użytkownikowi:**
- Zmienić plan
- Anulować subskrypcję
- Zaktualizować metodę płatności
- Pobrać faktury

#### 4. Trial Period (opcjonalnie)

```typescript
// 14-dniowy trial przy rejestracji
const session = await stripe.checkout.sessions.create({
  // ... inne opcje
  subscription_data: {
    trial_period_days: 14,
    trial_settings: {
      end_behavior: {
        missing_payment_method: 'cancel'
      }
    }
  }
});
```

---

## Panel Administracyjny

### Ekrany Dashboard

#### 1. Overview (Główny widok)

```typescript
// /dashboard/overview
interface DashboardOverview {
  user: {
    name: string;
    email: string;
    plan: string;
    avatar_url?: string;
  };

  stats: {
    generations_this_month: number;
    generations_limit: number;
    percentage_used: number;
    days_until_reset: number;
  };

  recent_generations: Generation[];

  quick_actions: [
    { label: "Copy API Key", action: () => void },
    { label: "Upgrade Plan", link: "/billing" },
    { label: "View Docs", link: "/docs" }
  ];
}
```

**UI Components:**
- Welcome message z imieniem
- Pasek progresu użycia limitu
- Karta z aktywnym planem
- Lista ostatnich 5 generowań
- Wykres generowań z ostatnich 30 dni

#### 2. API Keys

```typescript
// /dashboard/api-keys
interface ApiKeysPage {
  api_keys: Array<{
    id: string;
    name: string;
    key_prefix: string; // "wlag_live_1234..."
    website_url?: string;
    created_at: string;
    last_used_at?: string;
    total_requests: number;
    is_active: boolean;
  }>;
}
```

**Funkcjonalności:**
- Lista wszystkich kluczy
- Przycisk "Create New API Key"
- Dialog pokazujący pełny klucz TYLKO raz po utworzeniu
- Kopiowanie do schowka
- Deaktywacja/usunięcie klucza
- Statystyki użycia każdego klucza

**UI Dialog przy tworzeniu klucza:**
```
┌───────────────────────────────────────────────┐
│ Your API Key                                  │
│                                               │
│ ⚠️  Save this key now - you won't see it     │
│    again!                                     │
│                                               │
│ ┌───────────────────────────────────────────┐ │
│ │ wlag_live_abc123...xyz789      [Copy]    │ │
│ └───────────────────────────────────────────┘ │
│                                               │
│ [ I've saved my key ]                         │
└───────────────────────────────────────────────┘
```

#### 3. Generations History

```typescript
// /dashboard/generations
interface GenerationsPage {
  generations: Generation[];
  filters: {
    date_from?: string;
    date_to?: string;
    status?: 'success' | 'failed';
    search?: string; // szukaj po nazwie produktu
  };
  pagination: {
    page: number;
    total_pages: number;
    total_items: number;
  };
}
```

**Tabela z kolumnami:**
- Data/czas
- Nazwa produktu
- Status (success/failed)
- Użyty szablon
- Czas przetwarzania
- Akcje (View, Copy content)

**Filtrowanie:**
- Zakres dat (date picker)
- Status
- Wyszukiwanie po nazwie

#### 4. Billing & Subscription

```typescript
// /dashboard/billing
interface BillingPage {
  current_subscription: {
    plan: Plan;
    status: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
  };

  available_plans: Plan[];

  payment_history: Payment[];

  payment_method: {
    type: string; // card, paypal
    last4?: string;
    brand?: string; // visa, mastercard
    exp_month?: number;
    exp_year?: number;
  };
}
```

**Sekcje:**

**A. Current Plan**
```
┌─────────────────────────────────────────┐
│ Professional Plan                        │
│ $149/month                              │
│                                         │
│ 78 / 200 generations used this month   │
│ [████████░░] 39%                        │
│                                         │
│ Next billing date: Jan 15, 2025        │
│                                         │
│ [Manage Subscription]  [Cancel Plan]   │
└─────────────────────────────────────────┘
```

**B. Available Plans** (jeśli chce zmienić)
- Karty z planami Free/Starter/Pro/Agency
- Przycisk "Upgrade" / "Downgrade"
- Porównanie funkcji

**C. Payment History**
```
┌─────────────────────────────────────────┐
│ Date       Amount    Status    Invoice  │
│ ──────────────────────────────────────  │
│ Dec 15    $149.00   Paid      [📄 PDF]  │
│ Nov 15    $149.00   Paid      [📄 PDF]  │
│ Oct 15    $149.00   Paid      [📄 PDF]  │
└─────────────────────────────────────────┘
```

**D. Payment Method**
- Karta z current payment method
- Przycisk "Update Payment Method" → otwiera Stripe Portal

#### 5. Settings

```typescript
// /dashboard/settings
interface SettingsPage {
  tabs: [
    'Profile',
    'Preferences',
    'Notifications',
    'Security'
  ];
}
```

**Profile Tab:**
- Imię/nazwisko
- Email (readonly, link do zmiany)
- Firma
- Avatar upload
- Timezone

**Preferences Tab:**
- Domyślny szablon
- Domyślny ton AI (professional/casual/enthusiastic)
- Język

**Notifications Tab:**
- Email przy zbliżaniu się do limitu (80%, 100%)
- Email przy nieudanej płatności
- Newsletter/marketing emails

**Security Tab:**
- Zmiana hasła
- Sesje aktywne (lista + logout all)
- Two-Factor Authentication (2FA) - opcjonalnie
- Delete account

#### 6. Analytics (dla wyższych planów)

```typescript
// /dashboard/analytics
interface AnalyticsPage {
  date_range: { from: string; to: string };

  metrics: {
    total_generations: number;
    success_rate: number;
    avg_processing_time: number;
    most_popular_template: string;
  };

  charts: {
    generations_over_time: ChartData;
    templates_usage: ChartData;
    products_generated: ChartData;
  };
}
```

**Wykresy:**
- Line chart: Generowania w czasie
- Pie chart: Użycie szablonów
- Bar chart: Top 10 produktów

---

## Modyfikacja Wtyczki WordPress

### Zmiany w obecnej wtyczce

#### 1. Nowy ekran: Connection Settings

**Lokalizacja:** `WooCommerce > AI Landing Generator > Connection`

**UI:**
```php
// includes/class-wlag-connection.php
class WLAG_Connection {
    public function render_connection_page() {
        $api_key = get_option('wlag_api_key');
        $connection_status = $this->check_connection();
        ?>
        <div class="wrap">
            <h1>WooLanding AI - Connection</h1>

            <?php if ($connection_status['connected']): ?>
                <!-- Connected State -->
                <div class="wlag-connection-success">
                    <span class="dashicons dashicons-yes-alt"></span>
                    <h2>Connected!</h2>
                    <p>Account: <?php echo esc_html($connection_status['email']); ?></p>
                    <p>Plan: <?php echo esc_html($connection_status['plan']); ?></p>
                    <p>Generations: <?php echo $connection_status['usage']['used']; ?> / <?php echo $connection_status['usage']['limit']; ?></p>

                    <button class="button" onclick="wlagDisconnect()">Disconnect</button>
                </div>
            <?php else: ?>
                <!-- Disconnected State -->
                <div class="wlag-connection-setup">
                    <h2>Connect to WooLanding AI</h2>

                    <ol>
                        <li>
                            <a href="https://app.woolanding.com/register" target="_blank">
                                Create a free account
                            </a>
                        </li>
                        <li>Choose a plan and subscribe</li>
                        <li>
                            <a href="https://app.woolanding.com/dashboard/api-keys" target="_blank">
                                Generate an API key
                            </a>
                        </li>
                        <li>Paste your API key below:</li>
                    </ol>

                    <form method="post">
                        <?php wp_nonce_field('wlag_connect'); ?>

                        <table class="form-table">
                            <tr>
                                <th>API Key</th>
                                <td>
                                    <input
                                        type="text"
                                        name="api_key"
                                        class="regular-text code"
                                        placeholder="wlag_live_..."
                                    />
                                    <p class="description">
                                        Your API key starts with "wlag_live_"
                                    </p>
                                </td>
                            </tr>
                        </table>

                        <p class="submit">
                            <button type="submit" class="button button-primary">
                                Connect
                            </button>
                        </p>
                    </form>
                </div>
            <?php endif; ?>
        </div>
        <?php
    }

    private function check_connection() {
        $api_key = get_option('wlag_api_key');

        if (!$api_key) {
            return ['connected' => false];
        }

        // Sprawdź connection z API
        $response = wp_remote_get(
            API_URL . '/user/profile',
            [
                'headers' => [
                    'X-API-Key' => $api_key
                ],
                'timeout' => 10
            ]
        );

        if (is_wp_error($response)) {
            return ['connected' => false, 'error' => $response->get_error_message()];
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);

        if (wp_remote_retrieve_response_code($response) !== 200) {
            return ['connected' => false];
        }

        // Pobierz usage stats
        $usage_response = wp_remote_get(
            API_URL . '/usage/current',
            [
                'headers' => ['X-API-Key' => $api_key]
            ]
        );

        $usage = json_decode(wp_remote_retrieve_body($usage_response), true);

        return [
            'connected' => true,
            'email' => $body['user']['email'],
            'plan' => $body['subscription']['plan']['name'],
            'usage' => [
                'used' => $usage['generations_used'],
                'limit' => $usage['generations_limit']
            ]
        ];
    }
}
```

#### 2. Aktualizacja Generator Class

```php
// includes/class-wlag-generator.php

private function call_api_generate($product_data) {
    $api_key = get_option('wlag_api_key');

    if (!$api_key) {
        throw new Exception(__('API key not configured. Please connect your account.', 'wooland-ai-generator'));
    }

    // Przygotuj request
    $request_data = [
        'product' => [
            'id' => $product_data['id'],
            'name' => $product_data['name'],
            'price' => $product_data['price'],
            'sale_price' => $product_data['sale_price'],
            'image_url' => $product_data['image_url'],
            'description' => $product_data['description'],
            'short_description' => $product_data['short_description'],
            'category' => $product_data['category'],
        ],
        'options' => [
            'template' => get_option('wlag_default_template', 'default'),
            'tone' => get_option('wlag_ai_tone', 'professional'),
            'language' => get_locale()
        ]
    ];

    // Wywołaj API
    $response = wp_remote_post(
        API_URL . '/generate/landing-page',
        [
            'headers' => [
                'Content-Type' => 'application/json',
                'X-API-Key' => $api_key,
                'User-Agent' => 'WooLanding-WP-Plugin/' . WLAG_VERSION
            ],
            'body' => json_encode($request_data),
            'timeout' => 30
        ]
    );

    // Obsługa błędów
    if (is_wp_error($response)) {
        throw new Exception($response->get_error_message());
    }

    $status_code = wp_remote_retrieve_response_code($response);
    $body = json_decode(wp_remote_retrieve_body($response), true);

    // Handle różne kody błędów
    switch ($status_code) {
        case 200:
            return $body;

        case 401:
            throw new Exception(__('Invalid API key. Please reconnect your account.', 'wooland-ai-generator'));

        case 403:
            // Limit reached
            throw new Exception(
                sprintf(
                    __('Monthly limit reached (%d/%d). Upgrade your plan or wait until %s.', 'wooland-ai-generator'),
                    $body['usage']['generations_used'],
                    $body['usage']['generations_limit'],
                    date_i18n(get_option('date_format'), strtotime($body['usage']['reset_date']))
                )
            );

        case 429:
            throw new Exception(__('Too many requests. Please try again in a moment.', 'wooland-ai-generator'));

        default:
            throw new Exception($body['error'] ?? __('Unknown error occurred.', 'wooland-ai-generator'));
    }
}

public function handle_ajax_generate() {
    // ... walidacja jak wcześniej ...

    try {
        // Pobierz dane produktu
        $product_data = $this->fetch_product_data($product);

        // Wywołaj API zamiast mock_ai_response
        $api_response = $this->call_api_generate($product_data);

        // Przetwórz szablon - użyj HTML z API
        $content = $api_response['content']['html_template'];

        // Utwórz stronę
        $page_id = $this->create_landing_page($product_id, $content, $page_title);

        // Zwróć sukces z dodatkowymi info
        wp_send_json_success([
            'message' => __('Landing page created successfully!', 'wooland-ai-generator'),
            'page_id' => $page_id,
            'edit_url' => get_edit_post_link($page_id, 'raw'),
            'usage' => $api_response['usage'], // Pokaż usage stats
            'generation_id' => $api_response['generation_id']
        ]);

    } catch (Exception $e) {
        wp_send_json_error([
            'message' => $e->getMessage()
        ]);
    }
}
```

#### 3. Aktualizacja Metabox

```php
// includes/class-wlag-metabox.php

public function render_metabox($post) {
    $connection_status = $this->check_connection();

    if (!$connection_status['connected']) {
        ?>
        <div class="wlag-not-connected">
            <p><span class="dashicons dashicons-warning"></span>
                <?php _e('Not connected to WooLanding AI', 'wooland-ai-generator'); ?>
            </p>
            <a href="<?php echo admin_url('admin.php?page=wlag-connection'); ?>" class="button button-primary">
                <?php _e('Connect Now', 'wooland-ai-generator'); ?>
            </a>
        </div>
        <?php
        return;
    }

    // Pokaż usage stats
    ?>
    <div class="wlag-usage-stats">
        <p>
            <?php printf(
                __('Generations: %d / %d', 'wooland-ai-generator'),
                $connection_status['usage']['used'],
                $connection_status['usage']['limit']
            ); ?>
        </p>
        <div class="wlag-usage-bar">
            <div class="wlag-usage-fill" style="width: <?php echo ($connection_status['usage']['used'] / $connection_status['usage']['limit'] * 100); ?>%"></div>
        </div>
    </div>

    <!-- Reszta metabox jak wcześniej -->
    <?php
}
```

#### 4. JavaScript Updates

```javascript
// assets/js/admin.js

// Aktualizuj handleSuccess aby pokazać usage
handleSuccess: function(response) {
    if (response.success && response.data) {
        let message = wlagData.strings.success;

        if (response.data.edit_url) {
            message += ' <a href="' + response.data.edit_url + '" target="_blank">' +
                       wlagData.strings.editPage + '</a>';
        }

        // Pokaż usage stats
        if (response.data.usage) {
            message += '<br><small>' +
                       response.data.usage.generations_used + ' / ' +
                       response.data.usage.generations_remaining + ' ' +
                       'generations remaining this month</small>';
        }

        this.showSuccess(message);

        // Reload page
        setTimeout(() => location.reload(), 2000);
    }
},

// Lepsze error handling
handleError: function(jqXHR, textStatus, errorThrown) {
    let errorMessage = wlagData.strings.error + ' ';

    if (jqXHR.responseJSON && jqXHR.responseJSON.data) {
        const data = jqXHR.responseJSON.data;
        errorMessage += data.message;

        // Jeśli limit reached, pokaż link do upgrade
        if (jqXHR.status === 403 && data.limit_reached) {
            errorMessage += '<br><a href="https://app.woolanding.com/dashboard/billing" target="_blank">' +
                           'Upgrade your plan</a>';
        }
    }

    this.showError(errorMessage);
}
```

---

## Bezpieczeństwo

### Checklist zabezpieczeń

#### Backend API

- ✅ **HTTPS Only** - Wymuszaj SSL/TLS
- ✅ **CORS** - Konfiguracja dozwolonych origins
  ```typescript
  app.use(cors({
    origin: ['https://app.woolanding.com', 'https://woolanding.com'],
    credentials: true
  }));
  ```
- ✅ **Helmet.js** - Security headers
  ```typescript
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"]
      }
    }
  }));
  ```
- ✅ **Rate Limiting** - Zapobieganie brute force
- ✅ **SQL Injection** - Prepared statements, ORM
- ✅ **XSS Protection** - Sanityzacja inputu
- ✅ **CSRF Protection** - Tokeny dla form
- ✅ **Password Hashing** - bcrypt z cost=12
- ✅ **API Key Hashing** - Przechowuj tylko hashe
- ✅ **JWT Secret Rotation** - Regularnie zmieniaj secret
- ✅ **Input Validation** - Waliduj wszystkie inputy (Joi/Zod)
- ✅ **Output Encoding** - Escapuj wszystkie outputy
- ✅ **Dependency Scanning** - npm audit, Snyk
- ✅ **Error Handling** - Nie pokazuj stack traces w production

#### Wtyczka WordPress

- ✅ **Nonce Verification** - Dla wszystkich AJAX
- ✅ **Capability Checks** - current_user_can()
- ✅ **Sanitization** - sanitize_text_field(), absint()
- ✅ **Escaping** - esc_html(), esc_url(), esc_attr()
- ✅ **API Key Storage** - Nigdy w plain text
  ```php
  // Zamiast get_option(), użyj encrypted storage
  $encrypted_key = get_option('wlag_api_key_encrypted');
  $api_key = decrypt($encrypted_key, AUTH_KEY);
  ```

#### GDPR Compliance

- ✅ **Privacy Policy** - Link w footerze
- ✅ **Terms of Service** - Akceptacja przy rejestracji
- ✅ **Data Export** - User może wyeksportować swoje dane
- ✅ **Data Deletion** - User może usunąć konto
- ✅ **Cookie Consent** - Banner przy pierwszej wizycie
- ✅ **Email Opt-out** - Łatwe wypisanie z newslettera
- ✅ **Data Processing Agreement** - Dla Agency plan

#### PCI DSS

- ✅ **Stripe Hosted Checkout** - Nie przechowuj danych kart
- ✅ **Nigdy nie loguj** - Pełnych numerów kart, CVV

---

## Deployment i Hosting

### Wymagania serwerowe

**Backend API:**
- **CPU**: 2 vCPU (minimum), 4+ zalecane
- **RAM**: 4GB (minimum), 8GB+ zalecane
- **Storage**: 20GB SSD (rozszerzalne)
- **Bandwidth**: ~100GB/miesiąc (początkowo)

**Database:**
- **PostgreSQL 14+** lub **MySQL 8+**
- **RAM**: 2GB minimum
- **Storage**: 10GB SSD (rozszerzalne)

**Redis:**
- **RAM**: 1GB minimum
- **Persistence**: AOF enabled

### Rekomendowane platformy

#### Opcja 1: VPS (Najlepsza kontrola)

**DigitalOcean Droplet**
- Plan: $48/miesiąc (4GB RAM, 2 vCPU)
- Dodatkowo: Managed Database ($15/miesiąc)
- **Total**: ~$65/miesiąc

**Hetzner Cloud** (tańsze)
- Plan: CPX21 (€8.46/miesiąc)
- Database: Własny setup na tej samej maszynie
- **Total**: ~€10-15/miesiąc

**Setup:**
```bash
# Ubuntu 22.04
# 1. Zainstaluj Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Zainstaluj PostgreSQL
sudo apt install postgresql postgresql-contrib

# 3. Zainstaluj Redis
sudo apt install redis-server

# 4. Zainstaluj Nginx
sudo apt install nginx

# 5. Zainstaluj PM2 (process manager)
sudo npm install -g pm2

# 6. Zainstaluj Certbot (SSL)
sudo apt install certbot python3-certbot-nginx
```

#### Opcja 2: Platform-as-a-Service (Łatwiejszy)

**Railway.app**
- Backend: $5-20/miesiąc
- PostgreSQL: $5/miesiąc
- Redis: $5/miesiąc
- **Total**: ~$15-30/miesiąc
- **Zalety**: Auto-deploy z GitHub, łatwy setup

**Render.com**
- Podobne ceny i funkcje
- Darmowy SSL
- Auto-scaling

**Vercel + Supabase**
- Frontend: Darmowy (hobby plan)
- Backend API: Vercel Serverless Functions
- Database: Supabase (PostgreSQL) - $25/miesiąc
- **Total**: ~$25-50/miesiąc

#### Opcja 3: All-in-One

**AWS Lightsail**
- $20-40/miesiąc za VPS + Database
- Łatwiejszy niż pełny AWS

### Deployment Process

#### 1. Backend API

**Struktura projektu:**
```
backend/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
├── package.json
├── ecosystem.config.js (PM2)
└── Dockerfile (opcjonalnie)
```

**PM2 Ecosystem:**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'woolanding-api',
    script: './dist/server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

**Nginx Config:**
```nginx
# /etc/nginx/sites-available/api.woolanding.com

server {
    listen 80;
    server_name api.woolanding.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**SSL Setup:**
```bash
sudo certbot --nginx -d api.woolanding.com
```

**Deploy Script:**
```bash
#!/bin/bash
# deploy.sh

cd /var/www/woolanding-api
git pull origin main
npm install --production
npm run build
pm2 restart woolanding-api
pm2 save
```

**GitHub Actions (CI/CD):**
```yaml
# .github/workflows/deploy.yml

name: Deploy API

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to VPS
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/woolanding-api
            git pull
            npm install --production
            npm run build
            pm2 restart woolanding-api
```

#### 2. Frontend Dashboard

**Next.js Deploy na Vercel:**
```bash
# Podłącz repo GitHub do Vercel
# Vercel auto-deployuje przy każdym push do main

# Lub CLI:
npm install -g vercel
vercel --prod
```

**Environment Variables (Vercel):**
```bash
NEXT_PUBLIC_API_URL=https://api.woolanding.com/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

**Alternatywnie - własny serwer:**
```bash
# Build
npm run build

# Start
pm2 start npm --name "woolanding-dashboard" -- start
```

#### 3. Database Migrations

**Setup Knex.js:**
```bash
npm install knex pg
npx knex init
```

**Migration file:**
```javascript
// migrations/20240101_initial_schema.js

exports.up = function(knex) {
  // Twórz tabele (jak w sekcji Database Schema)
};

exports.down = function(knex) {
  // Rollback
};
```

**Deploy migrations:**
```bash
# Production
NODE_ENV=production npx knex migrate:latest
```

#### 4. Backup Strategy

**Automatyczne backupy PostgreSQL:**
```bash
# Cron job (codziennie o 2:00)
0 2 * * * /usr/local/bin/backup-db.sh

# backup-db.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U woolanding_user woolanding_db | gzip > /backups/db_$DATE.sql.gz

# Zachowaj tylko ostatnie 30 dni
find /backups -name "db_*.sql.gz" -mtime +30 -delete

# Upload do S3 (opcjonalnie)
aws s3 cp /backups/db_$DATE.sql.gz s3://woolanding-backups/
```

---

## Etapy Wdrożenia

### Faza 1: Backend API (4-6 tygodni)

**Tydzień 1-2: Setup i Auth**
- [ ] Setup projektu (Node.js + Express + TypeScript)
- [ ] Konfiguracja PostgreSQL
- [ ] Konfiguracja Redis
- [ ] Implementacja modeli bazy danych
- [ ] System rejestracji użytkowników
- [ ] Email weryfikacja
- [ ] Login + JWT
- [ ] Password reset flow

**Tydzień 3-4: Core Features**
- [ ] API Keys management
- [ ] Stripe integration (checkout + webhooks)
- [ ] Subscription management
- [ ] Usage tracking i limitowanie
- [ ] OpenAI integration
- [ ] Main endpoint: /generate/landing-page
- [ ] Rate limiting
- [ ] Error handling

**Tydzień 5-6: Polishing**
- [ ] Wszystkie pozostałe endpointy
- [ ] Testy jednostkowe
- [ ] Testy integracyjne
- [ ] Dokumentacja API (Swagger/OpenAPI)
- [ ] Setup monitoringu (Sentry)
- [ ] Deploy na VPS/Railway

**Deliverables:**
- ✅ Działające API
- ✅ Dokumentacja
- ✅ Testy (coverage >80%)

### Faza 2: Frontend Dashboard (3-4 tygodnie)

**Tydzień 1: Setup i Auth UI**
- [ ] Setup Next.js project
- [ ] Tailwind CSS + shadcn/ui
- [ ] Strona logowania
- [ ] Strona rejestracji
- [ ] Email verification flow
- [ ] Password reset flow
- [ ] Auth context i routing

**Tydzień 2: Dashboard Core**
- [ ] Layout (sidebar, navbar)
- [ ] Overview page
- [ ] API Keys page
- [ ] Generations history
- [ ] User settings

**Tydzień 3: Billing**
- [ ] Plans comparison page
- [ ] Stripe Checkout integration
- [ ] Billing page (current plan, payment history)
- [ ] Customer Portal integration
- [ ] Cancel/reactivate subscription

**Tydzień 4: Polishing**
- [ ] Analytics page (Pro+ plans)
- [ ] Responsive design
- [ ] Loading states
- [ ] Error states
- [ ] Toast notifications
- [ ] Deploy na Vercel

**Deliverables:**
- ✅ Pełny dashboard
- ✅ Responsive design
- ✅ Wszystkie funkcje

### Faza 3: Modyfikacja Wtyczki (1-2 tygodnie)

**Tydzień 1:**
- [ ] Connection settings page
- [ ] API key validation
- [ ] Zastąp mock AI prawdziwym API call
- [ ] Error handling (limit reached, invalid key, etc.)
- [ ] Usage stats w metabox
- [ ] JavaScript updates

**Tydzień 2:**
- [ ] Testy z prawdziwym API
- [ ] Edge cases
- [ ] Dokumentacja dla użytkowników
- [ ] Video tutorial (opcjonalnie)
- [ ] Przygotuj do publikacji na WordPress.org

**Deliverables:**
- ✅ Zaktualizowana wtyczka
- ✅ Instrukcje użytkowania
- ✅ Video tutorial

### Faza 4: Testing i Launch (2 tygodnie)

**Tydzień 1: Beta Testing**
- [ ] Closed beta z 10-20 użytkownikami
- [ ] Zbieranie feedbacku
- [ ] Bug fixing
- [ ] Performance tuning
- [ ] Security audit

**Tydzień 2: Launch**
- [ ] Marketing website (landing page)
- [ ] Blog post ogłaszający launch
- [ ] Social media posts
- [ ] Submit do WordPress.org
- [ ] Email kampania (jeśli masz listę)
- [ ] Public launch! 🚀

**Deliverables:**
- ✅ Stabilny produkt
- ✅ Marketing materials
- ✅ Pierwsi płacący klienci

---

## Kosztorys

### Koszty jednorazowe (Setup)

| Item | Koszt (PLN) |
|------|-------------|
| Domena (woolanding.com) | 50 / rok |
| Logo i branding | 500-2000 |
| SSL Certificate | 0 (Let's Encrypt) |
| **Total Setup** | **~600-2100 PLN** |

### Koszty miesięczne (Operacyjne)

| Item | Koszt (PLN/miesiąc) | Notatki |
|------|---------------------|---------|
| **Hosting (VPS)** | 200-300 | Hetzner/DigitalOcean |
| **Database** | 60-100 | Managed PostgreSQL |
| **Redis** | 30-50 | Redis Cloud |
| **Email Service** | 40-80 | SendGrid/Mailgun (do 10k emails) |
| **OpenAI API** | 200-1000 | Zależy od użycia, ~$0.01-0.03/generacja |
| **Stripe Fees** | 2.9% + 1 PLN | Per transakcja |
| **Monitoring** | 50-100 | Sentry, Logs |
| **Backups** | 20-40 | S3/Backblaze |
| **CDN** | 0-50 | Cloudflare (darmowy) |
| **Total Miesięczny** | **~600-1720 PLN** | Bez OpenAI może być 400-720 PLN |

**Skala kosztów według liczby klientów:**

| Użytkownicy | Hosting | OpenAI | Email | Total/miesiąc |
|-------------|---------|--------|-------|---------------|
| 0-50 | 200 PLN | 200 PLN | 40 PLN | ~500 PLN |
| 50-200 | 300 PLN | 500 PLN | 80 PLN | ~950 PLN |
| 200-500 | 500 PLN | 1500 PLN | 150 PLN | ~2200 PLN |
| 500-1000 | 800 PLN | 3000 PLN | 200 PLN | ~4200 PLN |

**Break-even analiza:**

Przy cenie 49 PLN/miesiąc (plan Starter):
- **Punkt rentowności**: ~15 płacących klientów
- **Do profitable growth**: 30-50 klientów

### Koszty rozwoju (Work)

**Opcja A: Samodzielnie**
- Czas: ~10-12 tygodni
- Koszt: 0 PLN (twój czas)
- Ryzyko: Wysokie (wszystko sam)

**Opcja B: Freelancer**
- Backend dev: 30,000-50,000 PLN
- Frontend dev: 20,000-35,000 PLN
- **Total**: 50,000-85,000 PLN

**Opcja C: Agency**
- Full projekt: 80,000-150,000 PLN
- Czas: 8-12 tygodni
- Wsparcie: Maintenance included

---

## Timeline

### Optymistyczny (10 tygodni)

```
Week 1-2:   Backend Auth + Database
Week 3-4:   Backend Core Features
Week 5-6:   Backend Polish + Deploy
Week 7-8:   Frontend Dashboard
Week 9:     Frontend Polish + Deploy
Week 10:    Wtyczka Update
Week 11:    Testing
Week 12:    Launch 🚀
```

### Realistyczny (14 tygodni)

```
Week 1-3:   Backend Auth + Database
Week 4-6:   Backend Core Features
Week 7-8:   Backend Polish + Deploy
Week 9-11:  Frontend Dashboard
Week 12:    Frontend Polish + Deploy
Week 13:    Wtyczka Update
Week 14-15: Testing
Week 16:    Launch 🚀
```

### Z buforem (16-20 tygodni)

Dodaj 25% czasu na nieprzewidziane:
- Bugs
- Zmiany wymagań
- Testing iterations
- Marketing preparations

---

## Następne Kroki - Quick Start

### Co zrobić TERAZ:

1. **Decyzja o stack'u**
   - Node.js czy Laravel?
   - Gdzie hosting? (Railway vs VPS)
   - Która baza danych?

2. **Setup podstawowy**
   ```bash
   # Backend
   mkdir woolanding-backend
   cd woolanding-backend
   npm init -y
   npm install express typescript @types/node

   # Frontend
   npx create-next-app@latest woolanding-dashboard
   ```

3. **Konto Stripe**
   - Załóż konto: https://stripe.com
   - Tryb testowy na początek
   - Skonfiguruj produkty (plans)

4. **Konto OpenAI**
   - Załóż konto: https://platform.openai.com
   - Dodaj billing
   - Wygeneruj API key

5. **Git Repository**
   ```bash
   # Stwórz prywatne repo
   git init
   git remote add origin ...
   ```

---

## Pytania do rozstrzygnięcia

Przed startem odpowiedz na:

1. **Tech stack**: Node.js czy Laravel? (Rekomendacja: Node.js)
2. **Hosting**: VPS czy PaaS? (Rekomendacja: Railway na start)
3. **Budget**: Masz budżet na development? (50k+ PLN = freelancer)
4. **Time**: Ile czasu możesz poświęcić? (Full-time = 12 tyg, Part-time = 20+ tyg)
5. **AI Provider**: OpenAI czy Claude? (Rekomendacja: OpenAI GPT-4)
6. **Payment**: Tylko Stripe czy też PayPal?
7. **Target market**: Polska czy global? (Wpływa na pricing i język)

---

**Powodzenia z projektem! 🚀**

Jeśli masz pytania lub potrzebujesz pomocy z konkretnym etapem, daj znać!
