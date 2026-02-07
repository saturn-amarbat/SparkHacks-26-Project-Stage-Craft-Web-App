# 🎭 StageCraft

**The Agentic Marketplace for Theatrical Assets**

Built for SparkHacks 2026 - Shop Savvy with Grainger Track

## Project Overview

StageCraft is an AI-powered P2P/B2C marketplace for renting and selling theatrical costumes, props, and technical equipment. Unlike traditional e-commerce platforms that rely on reactive keyword search, StageCraft uses an **Agentic AI Commerce Engine** powered by Claude 3.5 Sonnet and Model Context Protocol (MCP) to anticipate user needs through semantic inference.

### Key Features

- **AI-Powered Shopping Assistant**: Describe your character or production needs, and the AI automatically curates a shopping cart
- **Semantic Search**: Vector-based search powered by pgvector in Supabase
- **P2P Marketplace**: Connect with costume houses, prop owners, and fellow theater makers
- **Gig Networking**: Discover casting calls and connect with productions
- **Smart Availability**: Real-time rental availability checking

## Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL + pgvector)
- **AI**: Anthropic Claude 3.5 Sonnet
- **AI SDK**: Vercel AI SDK
- **State Management**: Zustand
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Supabase account
- Anthropic API key
- OpenAI API key (for embeddings)

### Installation

1. **Dependencies are already installed**

2. **Set up environment variables**:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `ANTHROPIC_API_KEY`: Your Anthropic API key
- `OPENAI_API_KEY`: Your OpenAI API key (for embeddings)

3. **Set up Supabase database**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy the contents of `supabase-schema.sql`
   - Run the SQL to create tables, indexes, and functions

4. **Run the development server**:
```bash
npm run dev --turbo
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
stagecraft/
├── app/
│   ├── actions/           # Server Actions for data mutations
│   ├── api/
│   │   └── chat/         # AI chat endpoint
│   ├── marketplace/      # Marketplace pages
│   ├── gigs/            # Gig listings
│   └── page.tsx         # Landing page
├── components/
│   ├── ui/              # shadcn components
│   ├── product/         # Product components
│   ├── cart/            # Shopping cart
│   └── chat/            # AI chat interface
├── lib/
│   ├── ai/              # AI and MCP tools
│   ├── supabase/        # Supabase clients
│   ├── types.ts         # TypeScript types and Zod schemas
│   └── utils.ts         # Utility functions
└── supabase-schema.sql  # Database schema
```

## Key Development Commands

```bash
# Development (with Turbopack for faster compilation)
npm run dev --turbo

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint

# Add shadcn components
npx shadcn@latest add [component-name]
```

## Database Setup

The `supabase-schema.sql` file includes:
- Tables: profiles, products, rentals, cart_items, gig_listings, orders
- Vector search function: `match_products()`
- Row Level Security (RLS) policies
- Automatic profile creation on user signup
- Updated_at triggers

## AI Features

### Agentic Tools

The AI assistant has access to these tools via MCP:

1. **inventory_semantic_search**: Vector-based product search
2. **get_bundle_recommendations**: Role-based item bundles
3. **check_availability**: Rental availability checking
4. **create_cart_bundle**: Batch add items to cart

### Example Usage

User: *"I just got cast as Hamlet in a 1920s production. I need costume and props."*

AI:
- Analyzes intent (Hamlet, 1920s, modern-dress)
- Searches for: black tuxedo, skull prop, period accessories
- Checks availability
- Creates pre-filled cart
- Explains reasoning

## Data Strategy

For development/demo:
1. Use the mock data generation script (to be created)
2. Source realistic theatrical items from Etsy/eBay
3. Generate embeddings for all products using OpenAI API
4. Focus on quality over quantity (50-100 items is sufficient)

## Team Roles

- **Frontend (Jewel)**: UI components, pages, integration
- **Backend/AI (Saturn)**: MCP server, AI tools, Server Actions
- **Data/Systems (Bilguutei)**: Database, seeding, auth, RLS policies

## Deployment

Deploy to Vercel:
```bash
vercel
```

Set environment variables in Vercel dashboard.

## Contributing

This is a hackathon project. Focus on the core demo flow first:
1. Landing page → Browse → AI search → Cart → Checkout

Avoid over-engineering. Keep it simple and focused.

---

Built with ❤️ for SparkHacks 2026
