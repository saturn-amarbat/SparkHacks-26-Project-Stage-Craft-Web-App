# 🎭 StageCraft — AI-Powered Theatrical Marketplace

Welcome to **StageCraft**! Whether you're a director sourcing costumes for opening night, a prop master hunting for the perfect piece, or an actor looking for your next gig — StageCraft is built for you.

StageCraft is a modern marketplace for theatrical costumes, props, and equipment. It includes an **AI assistant** that lets you describe what you need in plain language and instantly surfaces the best matches. Spend less time searching and more time creating.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **AI-Powered Search** | Describe a role, era, or production concept and get relevant items instantly via semantic search. |
| 🛒 **Rent or Buy** | Browse the marketplace, add items to your cart, and check out — rental and purchase flows included. |
| 🤖 **AI Chat Assistant** | Chat with an AI that understands theatrical context and can search products or add items to your cart for you. |
| 👤 **User Profiles** | Sign up, manage your profile, and track your rental history. |
| 🎬 **Gigs & Casting** | Discover roles and crew opportunities *(coming soon — currently stubbed for future expansion)*. |

---

## 🚀 Getting Started

Follow these steps to run StageCraft locally on your machine.

### Prerequisites

- **Node.js** v18 or later — [download here](https://nodejs.org/)
- **npm** (included with Node.js)
- A **Supabase** project — [create one free](https://supabase.com/)
- An **OpenAI** API key — [get one here](https://platform.openai.com/api-keys)

### 1. Clone the repository

```bash
git clone https://github.com/saturn-amarbat/SparkHacks-26-Project-Stage-Craft-Web-App.git
cd SparkHacks-26-Project-Stage-Craft-Web-App/stagecraft
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file inside the `stagecraft/` directory:

```bash
cp /dev/null .env.local
```

Then add the following variables (replace the placeholder values with your own keys):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
OPENAI_API_KEY=your-openai-api-key
```

> **Where to find these values:**
> - Supabase keys → your Supabase dashboard → *Project Settings → API*
> - OpenAI key → [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### 4. Set up the database

Run the SQL in `supabase-schema.sql` against your Supabase project using the **SQL Editor** in your Supabase dashboard. This creates all the necessary tables, indexes, and security policies.

### 5. Seed the database (optional)

Populate the database with sample products so you can explore right away:

```bash
npm run seed
```

### 6. Start the development server

```bash
npm run dev
```

The app will be available at **[http://localhost:3000](http://localhost:3000)**.

---

## 🗺️ Using the App

1. **Home page** — Get an overview of StageCraft and jump into the marketplace or AI chat.
2. **Marketplace** (`/marketplace`) — Browse all available costumes, props, and equipment. Click any item for details.
3. **AI Chat** (`/chat`) — Describe what you're looking for in natural language (e.g., *"I need a Victorian-era gentleman's costume"*) and the AI will find matching items and can add them to your cart.
4. **Cart** (`/cart`) — Review items and proceed to checkout.
5. **Gigs** (`/gigs`) — Browse casting and crew listings *(feature in progress)*.
6. **Profile** (`/profile`) — View and manage your account.

> **Note:** The `/cart`, `/chat`, `/profile`, and `/checkout` pages require you to be signed in. You can create an account from the **Sign Up** page.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (React 19) |
| Language | TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui (Radix UI) |
| Backend & Auth | Supabase (Postgres, Auth, Storage) |
| AI | OpenAI (chat completions + embeddings) |
| Vector Search | Supabase pgvector |
| Animations | Framer Motion, Lenis (smooth scroll) |
| State Management | Zustand |

---

## 🔮 Next Steps

These are the planned enhancements on the roadmap:

- **💳 Payment System** — Integrate a payment provider (e.g., Stripe) to enable real transactions for rentals and purchases.
- **🌐 Domain & Hosting** — Deploy to a production host (e.g., Vercel) and connect a custom domain so StageCraft is publicly accessible via its own link.
- **🎬 Gigs & Casting** — Fully build out the gigs and casting board for the theater community.
- **📦 Order Tracking** — Add order status tracking and notifications for renters and sellers.

---

## 📜 License

This project was built during **SparkHacks 2026**.
