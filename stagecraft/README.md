# StageCraft: AI-Powered Theatrical Marketplace

## Elevating Theatrical Productions with Intelligent Assistance

StageCraft is an innovative marketplace designed to revolutionize how theatrical productions source costumes, props, and equipment. Leveraging the power of artificial intelligence, StageCraft provides an intuitive and seamless experience for directors, designers, and performers to find exactly what they need, exactly when they need it.

Our mission is to bridge the gap between creative vision and logistical execution, making the magic of theater more accessible and efficient for everyone involved.

---

## ✨ Key Features

*   **Intelligent AI Assistant:** Describe your needs in natural language ("I'm playing Hamlet in a 1920s NYC production"), and our AI recommends relevant items, checks availability, and even adds them to your cart.
*   **Semantic Search:** Go beyond keywords. Our search understands context, historical periods, character archetypes, and production styles.
*   **Comprehensive Marketplace:** Browse a curated selection of costumes, props, and equipment from various providers.
*   **Rental & Purchase Options:** Flexible options to rent items for specific durations or purchase unique pieces.
*   **User Profiles & Rental History:** Manage your listings, track your rentals, and keep a history of your theatrical journey.
*   **Gigs & Casting:** Discover new roles and connect with production opportunities (feature under development).

---

## 🧠 AI Integration

StageCraft's core intelligence is powered by a sophisticated integration of:

*   **OpenAI (GPT-4o):** Drives the conversational AI assistant, understanding user intent, executing complex tool calls, and generating natural language responses.
*   **OpenAI Embeddings (text-embedding-3-small):** Powers the semantic search functionality, converting textual descriptions into high-dimensional vectors for intelligent, context-aware matching within our inventory.
*   **Supabase `pgvector`:** Stores and indexes product embeddings, enabling lightning-fast similarity searches directly within the database.

This combination allows the AI to act as a truly intelligent shopping assistant, anticipating needs and streamlining the procurement process for theatrical items.

---

## 🚀 Technology Stack

StageCraft is built with modern, scalable technologies to deliver a fast and responsive user experience:

*   **Next.js 16 (React 19):** A powerful React framework for building full-stack web applications with server-side rendering and static site generation.
*   **Tailwind CSS 4:** A utility-first CSS framework for rapidly building custom designs.
*   **shadcn/ui:** A collection of beautifully designed, accessible, and customizable UI components built with Radix UI and Tailwind CSS.
*   **Supabase:** An open-source Firebase alternative providing a Postgres database, authentication, and storage solutions.
*   **Framer Motion:** A production-ready motion library for React, enabling fluid animations and interactive elements.
*   **Lenis:** A lightweight JavaScript library for creating smooth, performant scrolling experiences.
*   **TypeScript:** For enhanced code quality, maintainability, and developer experience.

---

## 🌟 Key Improvements Made (Our Journey to Polish)

Throughout the development process, we've meticulously refined StageCraft to ensure it's performant, intuitive, and visually stunning:

*   **Elevated UI/UX:** Transformed the user interface with an "Apple-like" aesthetic, focusing on clean lines, generous whitespace, and sophisticated visual hierarchies.
*   **Fluid Motion & Scrolling:** Integrated `Framer Motion` for elegant entrance animations on key sections and `Lenis` for silky-smooth, inertial scrolling across the entire application.
*   **Refined Typography:** Introduced **Playfair Display** for a premium, editorial feel on brand elements and headings, complemented by **Inter** for exceptional readability in body text.
*   **Enhanced Component Design:** Redesigned core UI elements like the Header, Product Cards, and Product Detail pages to be more minimal, interactive, and visually engaging, including subtle glassmorphism effects.
*   **Robust AI Assistant Migration:** Successfully migrated the AI chat backend from Google Gemini to OpenAI (GPT-4o), ensuring stable and reliable function calling for search and cart management. This involved adapting to OpenAI's specific tool-use protocols and refining chat history handling.
*   **Critical Bug Fixes:** Addressed and resolved several key issues, including:
    *   Fixing the "First content should be with role 'user'" error by correctly structuring chat history for the AI API.
    *   Eliminating UI layout overlaps, particularly with the fixed header obscuring page content.
    *   Ensuring UI buttons and navigation elements are fully interactive.
    *   **Enabled Guest Cart Viewing:** Modified cart logic to allow unauthenticated users (guests) to view items added by the AI assistant to a shared demo account, enhancing the showcase experience.
    *   **Updated Product Imagery:** Replaced broken product image links in the seed data with working, high-quality Unsplash URLs for a more professional presentation.

---

## 🛠️ Setup & Installation

To run StageCraft locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/saturn-amarbat/SparkHacks.git
    cd SparkHacks/stagecraft
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:**
    Create a `.env.local` file in the `stagecraft` directory based on `.env.local.example`. You'll need:
    *   Your **Supabase** Project URL and `anon` key.
    *   Your **Supabase Service Role Key**.
    *   A **Google API Key** (for Google Generative AI, though we primarily use OpenAI now).
    *   Your **OpenAI API Key** (essential for the AI Assistant's semantic search embeddings and GPT-4o chat).
    *   An **Anthropic API Key** (optional, if you plan to use Claude).
4.  **Seed the Database:**
    Run the seeding script to populate your Supabase database with demo products:
    ```bash
    npx tsx scripts/seed-products.ts
    # You might need to adjust the DEMO_OWNER_ID in seed-products.ts to a user ID from your Supabase auth table.
    ```
5.  **Run the Development Server:**
    ```bash
    npm run dev
    ```
    Open your browser to `http://localhost:3000`.

---

## 👩‍💻 Getting Started for Demo

To showcase StageCraft effectively:

1.  **Start the application:** Ensure your `npm run dev` server is running.
2.  **Navigate to the Landing Page:** Observe the polished UI, fluid animations, and smooth scrolling.
3.  **Explore the Marketplace:** Browse the redesigned product cards.
4.  **Engage the AI Assistant:**
    *   Go to the "AI Assistant" chat page.
    *   Try a prompt like: "I'm playing Hamlet in a 1920s NYC production."
    *   Observe how the AI suggests items and adds them to the cart.
    *   Check the shopping cart to see the items added by the AI (even as a guest!).
    *   Experiment with other search queries.
5.  **Showcase Responsive Design:** Resize your browser window to demonstrate mobile responsiveness.

We hope you enjoy StageCraft and see its potential to transform theatrical production workflows!