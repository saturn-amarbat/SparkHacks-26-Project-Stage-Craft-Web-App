# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**StageCraft** is a theatrical marketplace application for SparkHacks 2026 (Shop Savvy with Grainger track). This is an AI-powered P2P/B2C platform for renting and selling theatrical costumes, props, and technical equipment.

The core differentiator is an **Agentic AI Commerce Engine** that anticipates user needs through semantic inference - analyzing unstructured inputs (character descriptions, script scenes, historical eras) to automatically construct shopping carts, acting as an automated Costume Designer and Prop Master.

## Tech Stack

- **Framework**: Next.js 15 (App Router) with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL with pgvector for semantic search)
- **AI**: Anthropic Claude 3.5 Sonnet via Model Context Protocol (MCP)
- **AI SDK**: Vercel AI SDK for streaming responses
- **Deployment**: Vercel

## Development Commands

### Initial Setup
```bash
npx create-next-app@latest stagecraft --typescript --tailwind --eslint
cd stagecraft
npx shadcn@latest init
npm install @anthropic-ai/sdk ai @supabase/supabase-js
```

### Development
```bash
npm run dev --turbo  # Use Turbopack for faster compilation
```

### Building
```bash
npm run build
```

## Core Architecture

### 1. Agentic AI System (MCP-based)

The application uses the Model Context Protocol to enable Claude to interact with the database through defined tools:

**Tool Definitions:**
- `inventory_semantic_search(query, category)` - Uses pgvector to perform semantic search on product embeddings
- `get_bundle_recommendations(role_name)` - Returns pre-configured item bundles for theatrical roles
- `check_availability(item_id, date_range)` - Verifies rental availability
- `create_cart_bundle(product_ids)` - Batch adds items to cart

**Implementation Pattern:**
- Tools are defined in `app/api/mcp/` or using Vercel AI SDK tool definitions
- Claude autonomously calls these tools to fulfill user intents
- System prompt positions Claude as an expert theatrical costume designer/prop master

### 2. Vector Search Implementation

Supabase setup for semantic search:

```sql
-- Enable vector extension
create extension vector;

-- Add embedding column to products
alter table products add column embedding vector(1536);

-- Similarity search function
create or replace function match_products (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  name text,
  description text,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    products.id,
    products.name,
    products.description,
    1 - (products.embedding <=> query_embedding) as similarity
  from products
  where 1 - (products.embedding <=> query_embedding) > match_threshold
  order by products.embedding <=> query_embedding
  limit match_count;
end;
$$;
```

**Embedding Generation:**
- Use OpenAI's `text-embedding-3-small` API
- Concatenate: `name + description + tags` into single text blob
- Store 1536-dimensional vectors in pgvector column

### 3. Database Schema

**Core Tables:**
- `profiles` - User accounts with role (buyer/seller)
- `products` - Items with category (Costume/Prop/Equipment), description, rental_price_per_day, embedding vector
- `rentals` - Booking records with date ranges for availability checking
- `orders` - Purchase transactions
- `cart_items` - Shopping cart state
- `gig_listings` - Social networking feature for casting calls

**Security:**
- Row Level Security (RLS) policies ensure users can only edit their own listings
- Authentication handled via Supabase Auth with Next.js middleware

### 4. Frontend Architecture

**Key Components:**
- `ProductCard` - Grid display item with image, price, "Rent Now" button
- `SearchBar` - Combines keyword and semantic search
- `CartDrawer` - Shadcn Sheet component for cart UI
- `ChatInterface` - Floating AI assistant widget for agentic search
- `ProductDetail` - Individual product page with availability calendar

**State Management:**
- Server Components for data fetching (using Server Actions)
- Client state for cart (consider Zustand for shared state)
- Streaming AI responses via Vercel AI SDK

### 5. Server Actions Pattern

Next.js 15 Server Actions eliminate need for separate API layer:

```typescript
// app/actions/products.ts
'use server'

export async function getProducts() {
  const supabase = createServerClient()
  const { data, error } = await supabase.from('products').select('*')
  return data
}
```

## Data Strategy

### Mock Data Generation

**Do not use generic Lorem Ipsum** - use realistic theatrical data:

1. **Source Real Data:** Extract from Etsy (cosplay/costume listings) or theatrical rental sites
2. **Curate "Golden Set":** 50-100 high-quality items across categories
3. **Real Images:** Hotlink to actual product images (Etsy, eBay, Wikimedia Commons for public domain)
4. **Seed Script:** Create TypeScript script to batch insert JSON data into Supabase

**Critical:** Generate embeddings for all seeded products immediately after insertion.

### Sample Data Categories
- Costumes: Period-specific (1920s, Victorian, Medieval), character-specific (Hamlet, Wicked)
- Props: Weapons (swords, daggers), furniture, set pieces, character-specific items (skull for Hamlet)
- Equipment: Lighting, audio, rigging

## AI-Accelerated Development Workflow

### Tool Usage by Role

**Frontend (Jewel):**
- Use v0.dev for initial component designs
- Cursor CMD+K for small UI adjustments
- Cursor CMD+L for integration debugging

**Backend/AI (Saturn):**
- Claude Code CLI for multi-file refactoring
- Cursor for tool definition and MCP server implementation
- Focus on prompt engineering for the "StageCraft Agent" persona

**Data/Systems (Bilguutei):**
- Gemini 1.5 Pro for schema generation and mock data creation
- Claude Code for seeding scripts
- Cursor for RLS policy configuration

## Key Demo Flow: "The Hamlet Protocol"

The winning demo scenario showcases agentic commerce:

**User Input:** "I just got cast as Hamlet in a modern-dress production set in 1920s New York. I need a costume and props."

**Expected AI Behavior:**
1. Deconstruct intent: Role (Hamlet), Era (1920s), Setting (NYC), Gender (Male)
2. Apply theatrical knowledge: Skull (Yorick), black mourning attire, dagger/foil
3. Translate to 1920s context: Black wool tuxedo, silver cigarette case, vintage skull
4. Execute tools: `inventory_semantic_search("black tuxedo 1920s men")` → `check_availability()` → `create_cart_bundle()`
5. Return structured cart with reasoning

## Critical Implementation Notes

### Avoid Over-Engineering
- Do not add features beyond requirements
- No unnecessary abstractions, helpers, or premature optimizations
- Keep solutions focused and minimal
- Only add error handling at system boundaries (user input, external APIs)

### Security
- Validate at system boundaries only
- Use Supabase RLS for data access control
- Never commit API keys (use .env.local)
- Trust internal code and framework guarantees

### AI Agent Constraints
- System prompt must enforce: "ONLY recommend products returned by search_inventory tool"
- Never allow LLM to invent products, prices, or availability
- Render structured Product Cards from tool results, not LLM-generated text
- Implement graceful fallbacks for empty search results

### Performance
- Use Vercel AI SDK streaming to prevent function timeouts
- Optimize tool execution for <10s response time
- Consider Supabase Edge Functions for heavy processing

### Type Safety
- Use Zod schemas for shared types (Product, User, Order)
- Single source of truth in `lib/types.ts`
- Import schemas in both frontend components and backend scripts

## Common Pitfalls

1. **LLM Hallucination:** LLM inventing non-existent products → Enforce strict tool-only responses
2. **Function Timeouts:** Slow API calls timing out Vercel functions → Use streaming responses
3. **Integration Failures:** Type mismatches between frontend/backend → Use shared Zod schemas
4. **Empty Demo Database:** Forgetting to seed → Automate seeding in setup script
5. **Missing Embeddings:** Products without vectors → Generate embeddings immediately after product insertion

## Team Coordination

- **Parallel Development:** Frontend, Backend, and Data roles work independently using Server Actions as interface contract
- **Merge Strategy:** Frequent small commits to avoid conflicts
- **Testing Priority:** Focus on "happy path" (demo scenario) over edge cases
- **Code Review:** Use Claude Code for cleanup (remove unused imports, console.logs) before demo