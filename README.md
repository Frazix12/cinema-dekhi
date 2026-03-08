# Cinema Dekhi

A basic movie discovery web app built with Next.js, TypeScript, TMDB, and Supabase.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Supabase
- TMDB API

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Set up environment variables

```bash
cp .env.local.example .env.local
```

If you are running local Supabase services, also copy:

```bash
cp .env.example .env
```

### 3) Start the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Available Scripts

- `npm run dev` - Start Next.js in development mode
- `npm run build` - Create a production build
- `npm run start` - Start the production server
- `npm run lint` - Run lint checks
- `npm run sb-start` - Start local Supabase services
- `npm run sb-stop` - Stop local Supabase services
- `npm run sb-restart` - Restart local Supabase services
- `npm run sb-db-reset` - Reset local Supabase database
- `npm run sb-db-types` - Generate Supabase TypeScript types

## License

MIT (see `LICENSE`).
