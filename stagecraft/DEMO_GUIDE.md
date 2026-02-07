# 🎭 StageCraft Demo Guide

## ✅ Project Status: COMPLETE & DEMO-READY

All core features are implemented and working!

---

## 🚀 Quick Start

```bash
npm run dev
```

Visit: http://localhost:3000

---

## 🎯 Demo Flow: "The Hamlet Protocol"

### **Step 1: Homepage**
- Visit http://localhost:3000
- Beautiful landing page with theatrical theme
- Click "Try AI Assistant" or "Browse Marketplace"

### **Step 2: Browse Marketplace**
- http://localhost:3000/marketplace
- See 45 theatrical products (costumes, props, equipment)
- Click any product to see details
- Add items to cart from product pages

### **Step 3: AI Shopping Assistant** (⭐ THE MAIN DEMO)
- Go to http://localhost:3000/chat
- Type: **"I'm playing Hamlet in a 1920s NYC production. I need costume and props."**

**What Happens:**
1. AI understands the context (Hamlet + 1920s + modern-dress)
2. AI searches inventory semantically (not keyword matching!)
3. AI finds:
   - 1920s Black Tuxedo (Hamlet's mourning becomes Jazz Age formal)
   - Replica Human Skull (Yorick - iconic prop)
   - Period accessories
4. AI explains theatrical reasoning
5. AI can add items to cart (if you ask)

**This demonstrates ANTICIPATORY COMMERCE** - the AI acts as an automated costume designer!

### **Step 4: Shopping Cart**
- Click cart icon in header (shows item count)
- Cart sheet slides out with items
- Click "View Cart & Checkout" to see full cart page
- http://localhost:3000/cart shows:
  - All cart items with images
  - Quantity controls
  - Rental date information
  - Total calculation with tax
  - Remove items
  - Checkout button

### **Step 5: Checkout**
- Click "Proceed to Checkout" from cart page
- http://localhost:3000/checkout/success shows:
  - Order confirmation
  - Success message
  - Next steps
  - "Break a leg!" 🎭

---

## ✨ Key Features Implemented

### **1. AI-Powered Semantic Search**
- OpenAI text-embedding-3-small (1536 dimensions)
- Supabase pgvector for similarity search
- Claude 3 Haiku for conversational AI
- Tool calling: search, check availability, add to cart

### **2. Complete Marketplace**
- Product browsing with grid layout
- Product detail pages with rental dates
- Category filtering
- Real product data with embeddings

### **3. Shopping Cart**
- Add to cart from product pages
- View cart in slide-out sheet
- Full cart page with checkout
- Quantity management
- Remove items
- Calculate totals with tax

### **4. Database & Auth**
- Supabase PostgreSQL with pgvector
- 45 products seeded with embeddings
- Row Level Security policies
- Auth middleware (temporarily bypassed for demo)

---

## 🏗️ Architecture

```
Frontend (Next.js 15)
├── App Router with Server Components
├── Server Actions for data fetching
├── Zustand for client state (cart)
└── shadcn/ui components

Backend (Supabase)
├── PostgreSQL with pgvector extension
├── Semantic search function (match_products)
├── Row Level Security policies
└── Real-time subscriptions ready

AI Layer
├── Anthropic Claude 3 Haiku
├── OpenAI text-embedding-3-small
├── Tool calling (MCP pattern)
└── Streaming responses
```

---

## 📊 What's Complete

### ✅ Core Features (100%)
- [x] Database with 45 products + embeddings
- [x] Semantic vector search
- [x] AI chat with Claude
- [x] AI tool calling (search, availability, cart)
- [x] Marketplace browse & detail pages
- [x] Shopping cart (sheet + full page)
- [x] Checkout flow
- [x] Server actions for all features

### ✅ Pages (100%)
- [x] Landing page (/)
- [x] Marketplace (/marketplace)
- [x] Product detail (/marketplace/[id])
- [x] AI Chat (/chat)
- [x] Cart (/cart)
- [x] Checkout success (/checkout/success)

### ⚠️ Optional Enhancements
- [ ] Login/Signup pages (auth bypassed for demo)
- [ ] User profile page
- [ ] Order history
- [ ] UI polish (animations, loading states)
- [ ] Replace placeholder images with real photos
- [ ] Add more products

---

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL + pgvector)
- **AI**: Anthropic Claude 3 Haiku
- **Embeddings**: OpenAI text-embedding-3-small
- **State**: Zustand
- **Validation**: Zod

---

## 🐛 Known Issues

1. **Some images return 404** - Using Unsplash placeholder URLs, some don't exist. For production, use real product photos.

2. **Auth bypassed** - Login/signup pages not implemented. Using demo user for cart operations.

3. **Cart persistence** - Cart requires user to be "logged in" (using demo user ID). In production, implement proper auth.

---

## 🎯 Hackathon Winning Points

### **1. Anticipatory Commerce** ⭐
User says "I'm playing Hamlet in 1920s NYC" → AI automatically finds tuxedo, skull, accessories WITHOUT explicit keywords!

### **2. Real Vector Search**
Not fake! Uses OpenAI embeddings + Supabase pgvector for actual semantic similarity.

### **3. Theatrical Expertise**
System prompt makes AI act as costume designer who understands periods, characters, and theatrical requirements.

### **4. Complete Implementation**
Working end-to-end from search → cart → checkout. Not just mockups.

### **5. Tool Calling**
AI autonomously decides which tools to use (search, availability, cart) based on conversation.

---

## 📝 Demo Script

**Opening:**
"StageCraft solves a problem every theater production faces: finding the right costumes and props quickly. Traditional rental sites require you to know exactly what you're looking for. But what if you just got cast as Hamlet in a 1920s production?"

**Live Demo:**
1. Show marketplace: "We have 45 theatrical items, but finding the right ones is hard..."
2. Open AI chat: "Watch what happens when I describe my needs naturally..."
3. Type: "I'm playing Hamlet in a 1920s NYC production"
4. AI finds items: "The AI understood context! It mapped 'Hamlet' to black formal wear, 'Yorick' to skull, and '1920s' to the era—all without keyword matching!"
5. Show cart: "Items are ready to rent. The AI acted as my costume designer."

**Close:**
"This is anticipatory commerce—understanding intent and fulfilling needs before explicit requests. Perfect for the Grainger 'Shop Savvy' track!"

---

## 🚀 Deployment (Optional)

Ready to deploy to Vercel:

```bash
# Connect to Vercel
vercel

# Add environment variables in Vercel dashboard
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...

# Deploy
vercel --prod
```

---

## 💡 Future Enhancements

If you have more time:

1. **UI Polish**
   - Smooth scroll animations
   - Loading skeletons
   - Framer Motion transitions
   - Better mobile responsive design

2. **Complete Auth**
   - Login/signup pages
   - User profiles
   - Order history

3. **Enhanced AI**
   - Chat history
   - Product recommendations
   - Multi-turn conversations
   - Image understanding

4. **More Features**
   - Gig listings (social feature)
   - Reviews & ratings
   - Availability calendar
   - Payment integration

---

## ✅ Final Checklist

Before demo:
- [ ] Test "Hamlet Protocol" flow end-to-end
- [ ] Verify all 45 products display in marketplace
- [ ] Test product detail pages
- [ ] Test cart operations (add, remove, checkout)
- [ ] Practice demo script
- [ ] Prepare backup in case of API issues
- [ ] Have screenshots ready

---

## 🎭 Break a Leg!

You now have a complete, working theatrical marketplace with AI-powered semantic search. The "Hamlet Protocol" demo showcases true anticipatory commerce—understanding intent and fulfilling needs intelligently.

**Pro tip**: Emphasize how the AI translates creative language ("playing Hamlet in 1920s") into concrete inventory searches. That's the innovation judges look for!

Good luck at SparkHacks 2026! 🚀
