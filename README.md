# StageCraft: AI-Powered Theatrical Marketplace

StageCraft is a marketplace for theatrical costumes, props, and equipment with an AI assistant that helps production teams find the right items fast. The goal is simple: reduce time spent hunting for assets so teams can focus on the creative work.

## What it does

- Natural language discovery. Describe a role or production concept and get relevant items immediately.
- Semantic search that understands era, character type, and production context.
- Rental and purchase workflows, plus user profiles and rental history.
- A demo-friendly flow where the AI can add items to a shared cart for quick showcasing.
- Gigs and casting are stubbed for future expansion.

## AI and search stack

- OpenAI chat model for the assistant’s dialogue and tool orchestration.
- OpenAI embeddings for semantic search over product descriptions.
- Supabase with pgvector to store and query embeddings directly in Postgres.

## Technology used

- Next.js 16 (React 19)
- TypeScript
- Tailwind CSS 4
- shadcn/ui (Radix UI + Tailwind)
- Supabase (Auth + Postgres + Storage)
- Framer Motion
- Lenis

## What we built and refined

- A polished marketplace UI with consistent spacing, typography, and responsive behavior.
- Smooth page transitions and scroll feel using Framer Motion and Lenis.
- Product cards and detail views designed for fast scanning and clean presentation.
- A stable AI chat flow with proper role handling and tool calling for search and cart actions.
- Demo seeding with production-ready product data and updated imagery.
- Guest-friendly cart viewing to make live demos smoother.

## Local setup

1. Clone the repository
2. `cd stagecraft && npm install`
3. Create `.env.local` in `stagecraft/` with the following keys:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Seed the database: `npm run seed` and `npm run seed:gigs`
5. Run the dev server: `npm run dev` and open http://localhost:3000

## Deploy to Vercel

The fastest way to get a public URL for this project:

1. Push this repo to GitHub (already done).
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **Add New Project** and import this repository.
4. Set the **Root Directory** to `stagecraft`.
5. Add the environment variables listed above in the Vercel project settings.
6. Click **Deploy**. Vercel will build and host the app automatically.
7. Share the generated `.vercel.app` URL with anyone who wants to check it out.


