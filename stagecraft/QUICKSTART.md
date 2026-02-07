# StageCraft Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- Supabase account (free tier works)
- Anthropic API key (for Claude)
- OpenAI API key (for embeddings)

## 5-Minute Setup

### 1. Environment Variables (2 minutes)

Create `.env.local`:

```bash
# Get these from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Get from console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-xxx

# Get from platform.openai.com
OPENAI_API_KEY=sk-xxx
```

### 2. Database Setup (1 minute)

1. Go to Supabase SQL Editor
2. Paste entire contents of `supabase-schema.sql`
3. Click "Run"

### 3. Create User & Seed Data (2 minutes)

**Create a user:**
- Option A: Sign up through your app after starting it
- Option B: Create user in Supabase Dashboard > Auth > Users

**Get user UUID:**
1. Copy the UUID from Supabase Auth panel
2. Open `scripts/seed-products.ts`
3. Replace `YOUR_USER_UUID_HERE` with your UUID (line ~135)

**Run seed script:**
```bash
npm run seed
```

Wait ~2-3 minutes for all products to be created with embeddings.

### 4. Start App

```bash
npm run dev
```

Visit http://localhost:3000

## Test the Demo

1. Go to `/chat`
2. Type: "I'm playing Hamlet in a 1920s NYC production"
3. Watch the AI:
   - Search for period-appropriate items
   - Add them to your cart automatically
   - Explain theatrical reasoning

## Common Issues

**Build fails**: Make sure all env vars are set
**Seed fails**: Check user UUID exists in Supabase Auth
**Chat returns 401**: User must be logged in (middleware protection)
**No search results**: Lower match_threshold in `lib/ai/tools.ts` from 0.7 to 0.5

## What's Included

- 50+ theatrical products with real embeddings
- AI semantic search using OpenAI + pgvector
- Claude 3.5 Sonnet chat with tool calling
- Complete marketplace with cart
- Mobile responsive UI

## Architecture

```
User Input → Claude → Tool Calls → Vector Search → Cart Update → Response
```

See `IMPLEMENTATION_GUIDE.md` for full details.

## Demo Tips

Best prompts to showcase:
- "I'm playing Hamlet in a 1920s production"
- "I need props for a Victorian murder mystery"
- "What should I wear as Ophelia?"
- "I'm doing a medieval fantasy play"

## Next Steps

1. Test the "Hamlet Protocol" demo thoroughly
2. Add more products if needed (`scripts/seed-products.ts`)
3. Customize system prompt (`app/api/chat/route.ts`)
4. Deploy to Vercel
5. Create demo video

Good luck! 🎭
