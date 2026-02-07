# **Operation StageCraft: AI-Accelerated Strategic Blueprint**

## **1\. The "Vibe Coding" Workflow**

Traditional coding involves typing every character. **Vibe Coding** involves acting as an Architect while the AI acts as the Bricklayer. Your team will use **Cursor**, **Claude Code**, and **Gemini** to generate code at 10x speed.

### **1.1 The AI Toolchain**

| Tool | Persona/Role | When to Use |
| :---- | :---- | :---- |
| **Cursor (IDE)** | **The Builder** | The primary code editor. Use CMD+K to generate small UI components and CMD+L (Chat) to debug errors instantly. |
| **Claude Code (CLI)** | **The Architect** | Use in the terminal for complex, multi-file tasks. Example: *"Refactor the entire auth flow to use Supabase SSR instead of client-side auth."* It manages the file system autonomously. |
| **Gemini 1.5 Pro** | **The Librarian** | Use for massive context. Dump entire documentation sets (Next.js 15 docs, Grainger PDFs, Supabase docs) into Gemini and ask it to generate your initial database schema. |
| **v0.dev** | **The Designer** | **Jewel's Weapon.** Don't write CSS. Describe the interface to v0.dev, copy the React code, and paste it into Cursor. |

---

## **2\. Revised Role-Based AI Workflows**

### **2.1 Jewel (Frontend): The "Component Assembler"**

*Instead of writing Tailwind classes manually, you will assemble AI-generated blocks.*

1. **Prompt v0.dev:** *"A dark-mode theatrical marketplace dashboard with a sidebar, a stats card for 'Items Rented', and a grid of costume cards with 'Rent Now' buttons. Use a gold and velvet-red color scheme."*  
2. **Copy & Paste:** Take the generated code into Cursor.  
3. **Refine in Cursor:** Highlight the grid and press CMD+K: *"Make these cards responsive: 1 column on mobile, 3 on desktop."*  
4. **Connect:** Use CMD+L: *"@Saturn just built a getProducts server action. Wire this grid to fetch data from it."*

### **2.2 Saturn (Backend/AI): The "Agent Orchestrator"**

*You are building the Brain. You need the smartest model (Claude 3.5 Sonnet).*

1. **Scaffold with Claude Code:** Run claude in terminal.  
   * *Prompt:* "Create a utils/ai folder. Inside, set up an Anthropic client. Create a tool definition for search\_inventory that takes a query string and returns JSON."  
2. **MCP Server Construction:**  
   * *Prompt:* "Read @modelcontextprotocol/sdk docs. Create a simple MCP server in app/api/mcp/route.ts that exposes our Supabase products table as a tool."  
3. **Debug with Cursor:** When the Agent fails to call a tool, paste the error logs into Cursor Chat.

### **2.3 Bilguutei (Data/Systems): The "Data Synthesizer"**

*A marketplace is dead without data. You will use Gemini's massive context window to hallucinate a realistic inventory.*

1. **Generate Schema (Gemini):** Paste the specific "Shop Savvy" track requirements into Gemini.  
   * *Prompt:* "Based on this track, write a Supabase SQL schema for products, rentals, and users. Include vector embeddings for the AI search."  
2. **Generate "Theatrical" Data (Gemini):**  
   * *Prompt:* "Generate a JSON array of 50 items. They must be theatrical props for 'Hamlet', 'Wicked', and 'Hamilton'. Include specific details like 'skull (yorick)', 'green elixir bottle', 'period-accurate corset'. Format for my SQL table."  
3. **Seed Database:** Use Cursor to write a seed.ts script that pushes this JSON to Supabase.

---

## **3\. The 20-Hour "Speed Run" Schedule**

### **Phase 1: The AI Setup (Hours 0 \- 2\)**

*Goal: A deployed "Hello World" with a database.*

* **All:** Initialize Repo. Install **Claude Code** (npm install \-g @anthropic-ai/claude-code).  
* **Bilguutei:** Ask Gemini to generate the schema.sql. Paste into Supabase SQL Editor.  
* **Jewel:** Ask v0.dev for a "Landing Page". Paste into page.tsx.  
* **Saturn:** Ask Claude Code: *"Scaffold a Next.js 15 app with Supabase Auth helper. Create the.env.local file structure."*

### **Phase 2: The "Vibe Coding" Sprint (Hours 3 \- 10\)**

*Goal: Feature Parity with eBay/Amazon.*

* **Jewel (UI):** Do not struggle with CSS alignment.  
  * *Cursor Prompt:* "Fix the padding on this navbar so it aligns with the logo. Add a 'Cart' icon that opens a Shadcn sheet."  
* **Saturn (Logic):**  
  * *Claude Code Prompt:* "Write a Server Action rentItem(id) that checks availability in the rentals table. If available, insert a new record. Handle race conditions."  
* **Bilguutei (Data):**  
  * *Task:* Run the seed script. Verify vector embeddings are generated for the AI search.

### **Phase 3: The "Agentic" Differentiator (Hours 11 \- 16\)**

*Goal: The "Shop Savvy" Feature.*

* **Saturn:** Implement the "Role-Based Search".  
  * *Claude Code Prompt:* "Create a Vercel AI SDK route. It should use the tool 'suggest\_outfit'. If the user says 'I'm playing Macbeth', the AI should query the vector store for 'Scottish king', 'dagger', and 'crown', then return those IDs."  
* **Jewel:**  
  * *Cursor Prompt:* "Create a chat interface that floats on the right. When the AI returns a list of products, render them as mini-cards inside the chat bubble."

### **Phase 4: Polish & "Smoke and Mirrors" (Hours 17 \- 20\)**

*Goal: Winning the Demo.*

* **Video:** Use **Screen Studio** (or similar) to record the demo flow.  
* **Voiceover:** Use **ElevenLabs** to generate a professional voiceover for the demo video if you are tired.  
* **Final Vibe Check:** Ask Claude Code: *"Scan my entire project for unused imports and console logs. Remove them."*

---

## **4\. Technical Stack Compliance Check**

* **Next.js 15 (App Router):** Allowed. Standard industry stack.  
* **Supabase:** Allowed.  
* **Anthropic API:** Allowed. (SparkHacks usually provides credits or sponsors, but have your own keys ready just in case).  
* **Vercel Deployment:** Allowed.

**Risk Mitigation:**

* **API Limits:** AI tools hit rate limits. **Have backup API keys.**  
* **"Lazy" Code:** AI often writes code that *looks* right but fails edge cases. **Test the "Happy Path" (the exact path you will show judges) relentlessly.**

## **5\. Summary of Commands**

* **Scaffold:** npx create-next-app@latest stagecraft \--typescript \--tailwind \--eslint  
* **Install UI:** npx shadcn@latest init  
* **Claude Code:** claude (in terminal)  
* **Run Dev:** npm run dev \--turbo (Use Turbopack for speed)

