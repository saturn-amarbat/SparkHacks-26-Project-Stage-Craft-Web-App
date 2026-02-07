# stagecraft: ai-powered theatrical marketplace

stagecraft is a marketplace for theatrical costumes, props, and equipment with an ai assistant that helps production teams find the right items fast. the goal is simple: reduce time spent hunting for assets so teams can focus on the creative work.

## what it does

- natural language discovery. describe a role or production concept and get relevant items immediately.
- semantic search that understands era, character type, and production context.
- rental and purchase workflows, plus user profiles and rental history.
- a demo-friendly flow where the ai can add items to a shared cart for quick showcasing.
- gigs and casting are stubbed for future expansion.

## ai and search stack

- openai chat model for the assistant’s dialogue and tool orchestration.
- openai embeddings for semantic search over product descriptions.
- supabase with pgvector to store and query embeddings directly in postgres.

## technology used

- next.js 16 (react 19)
- typescript
- tailwind css 4
- shadcn/ui (radix ui + tailwind)
- supabase (auth + postgres + storage)
- framer motion
- lenis

## what we built and refined

- a polished marketplace ui with consistent spacing, typography, and responsive behavior.
- smooth page transitions and scroll feel using framer motion and lenis.
- product cards and detail views designed for fast scanning and clean presentation.
- a stable ai chat flow with proper role handling and tool calling for search and cart actions.
- demo seeding with production-ready product data and updated imagery.
- guest-friendly cart viewing to make live demos smoother.
