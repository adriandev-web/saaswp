# WooLanding Frontend

Frontend aplikacji WooLanding AI Generator - platforma SaaS do generowania landing pages z wykorzystaniem sztucznej inteligencji.

## Technologie

- **React 18** - Biblioteka do budowy UI
- **TypeScript** - Typowanie
- **Vite** - Bundler i dev server
- **React Router** - Routing
- **Axios** - HTTP client

## Rozpoczęcie pracy

### Instalacja

```bash
npm install
```

### Konfiguracja

Skopiuj plik `.env.example` do `.env` i uzupełnij zmienne:

```bash
cp .env.example .env
```

### Uruchomienie dev server

```bash
npm run dev
```

Aplikacja będzie dostępna na `http://localhost:3001`

### Build produkcyjny

```bash
npm run build
```

### Podgląd build'a produkcyjnego

```bash
npm run preview
```

## Struktura projektu

```
src/
├── components/      # Komponenty React
│   ├── Layout.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
├── contexts/        # React Context
│   └── AuthContext.tsx
├── pages/           # Strony aplikacji
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   └── Generate.tsx
├── services/        # API client
│   └── api.ts
├── types/           # TypeScript types
│   └── index.ts
├── App.tsx          # Główny komponent
└── main.tsx         # Entry point
```

## Dostępne trasy

- `/` - Strona główna
- `/login` - Logowanie
- `/register` - Rejestracja
- `/dashboard` - Panel użytkownika (chronione)
- `/generate` - Generowanie landing pages (chronione)

## API

Frontend komunikuje się z backendem przez API client (`src/services/api.ts`).

Domyślnie API znajduje się pod adresem `http://localhost:3000/v1`.

## Autentykacja

Aplikacja używa JWT (JSON Web Tokens) do autentykacji:
- Access token - przechowywany w localStorage
- Refresh token - używany do odnowienia access token

Context `AuthContext` zarządza stanem autentykacji w całej aplikacji.

## Rozwój

### Dodawanie nowych stron

1. Utwórz komponent w `src/pages/`
2. Dodaj routing w `src/App.tsx`
3. Opcjonalnie dodaj link w nawigacji

### Dodawanie nowych API endpoints

1. Dodaj metodę w `src/services/api.ts`
2. Dodaj odpowiednie typy w `src/types/index.ts`

## Licencja

MIT
