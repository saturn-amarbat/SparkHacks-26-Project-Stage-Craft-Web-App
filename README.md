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
2. Install dependencies with npm
3. Create .env.local in stagecraft/ with Supabase and AI keys
4. Seed the database with the provided script
5. Run the dev server and open http://localhost:3000


