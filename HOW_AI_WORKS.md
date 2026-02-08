# how the ai works in stagecraft

this document explains the ai architecture behind stagecraft's intelligent shopping assistant — how it understands theatrical context, searches the inventory semantically, and helps users build carts.

## overview

stagecraft uses a three-layer ai system:

1. **conversational ai** — openai gpt-4o handles dialogue, understands user intent, and decides which tools to call.
2. **semantic search via embeddings** — openai `text-embedding-3-small` converts product descriptions and user queries into 1536-dimensional vectors. supabase (postgres + pgvector) stores these vectors and runs cosine similarity searches.
3. **tool calling** — the assistant has access to three server-side tools it can invoke during a conversation: inventory search, availability checking, and cart bundling.

```
user message
    │
    ▼
┌──────────────┐
│   gpt-4o     │  understands intent, decides which tools to call
└──────┬───────┘
       │ tool calls
       ▼
┌──────────────────────────────────────────────┐
│  tools                                       │
│  ┌────────────────────────┐                  │
│  │ inventory_semantic_    │  embeds query,   │
│  │ search                 │  queries pgvector│
│  └────────────────────────┘                  │
│  ┌────────────────────────┐                  │
│  │ check_availability     │  checks rental   │
│  │                        │  date conflicts  │
│  └────────────────────────┘                  │
│  ┌────────────────────────┐                  │
│  │ create_cart_bundle     │  adds items to   │
│  │                        │  user's cart     │
│  └────────────────────────┘                  │
└──────────────────────────────────────────────┘
       │ tool results
       ▼
┌──────────────┐
│   gpt-4o     │  formats results into a natural language response
└──────┬───────┘
       │
       ▼
assistant response (with optional product cards)
```

## step-by-step: what happens when you send a message

### 1. user sends a message

the react frontend (`components/chat/chat-interface.tsx`) sends the conversation history to `POST /api/chat`. it also includes `recentProductIds` — the product ids from the last assistant message that contained search results — so the backend can resolve cart additions without re-searching.

### 2. gpt-4o decides what to do

the chat api (`app/api/chat/route.ts`) sends the conversation to openai with a system prompt and three tool definitions. gpt-4o reads the conversation and either:
- responds directly (for greetings, clarifications, general questions), or
- calls one or more tools to fulfill the request.

the model decides which tools to call and with what arguments. for example, if a user says *"i'm playing hamlet in a 1920s production"*, the model might call `inventory_semantic_search` multiple times with queries like `"1920s formal menswear black tuxedo"` and `"skull prop yorick"`.

### 3. tools execute server-side

each tool runs on the server and interacts with supabase:

#### inventory_semantic_search

this is the core discovery tool. it:

1. takes the query string (e.g. `"1920s formal tuxedo"`)
2. sends it to openai's embedding api (`text-embedding-3-small`) to get a 1536-dimensional vector
3. calls the `match_products` postgres function via supabase rpc, which:
   - computes cosine similarity between the query vector and every product's stored embedding
   - filters out products below a similarity threshold (default 0.7)
   - returns the top matches sorted by similarity
4. optionally filters results by category (costume, prop, equipment)
5. returns product details (name, description, price, image, similarity score)

**key detail**: product embeddings are pre-computed at seed time. when a product is added to the database, its name, description, category, and tags are concatenated into a single string and embedded. this means the search understands relationships like "tuxedo" ↔ "formal menswear" or "yorick" ↔ "skull" without exact keyword matching.

#### check_availability

checks whether a product is available for rental during specific dates by querying the `rentals` table for overlapping bookings with active statuses (pending, confirmed, active).

#### create_cart_bundle

adds products to the authenticated user's cart. it:
- validates the user is authenticated and has a profile
- checks for existing cart items to avoid duplicates (increments quantity instead)
- batch-inserts new items and updates existing ones
- optionally attaches rental dates

the backend only allows adding products that were returned by a recent search, preventing the ai from adding arbitrary items.

### 4. gpt-4o formats the response

after all tool calls complete, their results are sent back to gpt-4o as tool response messages. the model then writes a natural language summary — describing the found items, explaining why they match, and asking if the user wants to add them to their cart.

### 5. frontend renders the response

the frontend receives the assistant message and, if products were returned, renders product cards alongside the text response. users can then ask the assistant to add items to their cart or search for something different.

## the system prompt

the system prompt (`app/api/chat/route.ts`) defines the assistant's behavior:

- **understand context first**: parse the character, era, production style, and setting from the user's description before searching.
- **only recommend real products**: never invent items — only suggest products returned by `inventory_semantic_search`.
- **don't auto-add to cart**: present recommendations first, then wait for explicit user confirmation before calling `create_cart_bundle`.
- **run new searches for new requests**: if the user asks for something different, always run a fresh search rather than reusing old results.

## how semantic search differs from keyword search

traditional keyword search matches exact words — searching for "tuxedo" wouldn't find an item described as "formal menswear". semantic search works differently:

1. both the query and every product description are converted into vectors (lists of numbers) that capture meaning.
2. vectors for semantically similar concepts end up close together in the vector space.
3. searching computes the distance between the query vector and each product vector, returning the closest matches.

this means:
- `"skull for graveyard scene"` finds the yorick skull prop even though "graveyard" isn't in its tags
- `"something for a gatsby-era party"` finds 1920s costumes and art deco accessories
- `"hamlet weapons"` finds the dagger and rapier props

## embedding model and vector storage

- **model**: `text-embedding-3-small` produces 1536-dimensional vectors
- **storage**: the `products` table has an `embedding vector(1536)` column powered by the pgvector postgres extension
- **search function**: `match_products` is a postgres function that computes `1 - (embedding <=> query_embedding)` (cosine similarity) and returns matches above the threshold
- **product text**: each product's embedding is generated from: `name | category | description | tag1, tag2, ...`

## files involved

| file | role |
|------|------|
| `app/api/chat/route.ts` | chat endpoint — orchestrates gpt-4o and tool calls |
| `lib/ai/tools.ts` | tool implementations — semantic search, availability, cart |
| `lib/ai/embeddings.ts` | embedding generation helpers |
| `components/chat/chat-interface.tsx` | frontend chat ui |
| `components/chat/chat-message.tsx` | individual message rendering |
| `components/chat/chat-product-card.tsx` | product card rendering in chat |
| `supabase-schema.sql` | database schema including pgvector setup and `match_products` function |
| `scripts/seed-products.ts` | seeds products with pre-computed embeddings |
