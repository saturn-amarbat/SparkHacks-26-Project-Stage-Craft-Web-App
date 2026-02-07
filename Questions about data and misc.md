Based on the SparkHacks requirements and standard hackathon winning strategies, here is the answer regarding your data and API strategy.

### **1\. Are we allowed to use mock data/visuals?**

**Yes, absolutely.** In fact, **mock data is preferred** for 24-hour hackathons.

* **Why?** Judges evaluate the *functionality* and the *idea*, not your database size. A live connection to a real supplier (like eBay or Amazon) is risky—if their API goes down, hits a rate limit, or requires complex authentication (OAuth) that takes 5 hours to debug, your demo fails.  
* **The "Smoke and Mirrors" Rule:** Your demo only needs to work for the *specific user journey* you show the judges. If you search for "Hamlet," and it works, it doesn't matter if searching for "Shrek" returns nothing.

### **2\. How should we source product details and pics? (Real vs. Mythical)**

You are correct: **Do not use "Lorem Ipsum" or "Product 1".** It kills the vibe.

You should use **Real Data** stored in a **Mock Database**.

**The Strategy: "The Golden Set"**

Instead of connecting to a live API, create a "Golden Set" of 50–100 items that *look* real but live in your Supabase database.

* **Images:** Go to **Etsy** (search "cosplay costume"), **eBay**, or a theatrical rental site like **Western Costume Co**. 1 Right-click the product images and "Copy Image Address." Use these real URLs in your database.  
* **Descriptions:** Copy the real descriptions. They contain the messy, human keywords (e.g., "Vintage 1920s Flapper Dress \- Great Gatsby Style") that will make your AI search feature shine.  
* **Pricing:** Copy the real prices to make the "Shop Savvy" aspect realistic.

### **3\. Would an API be the solution?**

**No.** Relying on a third-party product API (like eBay's Finding API or Amazon's PA-API) is a **trap** for a 20-hour hackathon.

* **The Trap:** These APIs often require "Partner Approval" (taking days), have strict rate limits, or return messy data you have to spend hours cleaning.  
* **The Exception:** You *will* use an API, but it will be **your own** Supabase API (which you built in the plan) serving the data you seeded.

### **4\. Was this included in the original strategy?**

**Yes.** In **Section 5 (Data Strategy)** of the original plan, I recommended the **"Seed Dataset Strategy."**

* *Original Plan:* "Generate a JSON array of 50 theatrical prop items... use dynamic placeholder services... or curate a list of 20 actual image URLs."  
* *Refined Advice:* Since you want it to look "Shop Savvy" professional, I am upgrading that advice: **Do not use AI-generated images.** Use real image URLs from the web (hotlinking is usually fine for a 24h hackathon demo) to make the marketplace look authentic.

---

### **Actionable Data Plan (The "2-Hour" Data Sprint)**

**Task for Bilguuteitr (Data Lead):**

1. **Source:** Go to **Etsy.com** (it has better cosplay/prop images than Amazon).  
2. **Scrape (Manual or AI):**  
   * *Manual:* Open a Google Sheet. Create columns: title, description, price, image\_url, category. Copy-paste 30 items for "Costumes" and 30 items for "Props".  
   * *AI (Gemini 1.5 Pro):* Take screenshots of Etsy search results. Upload to Gemini and ask: *"Extract the product title, price, and image URL from this screenshot and format it as a JSON object for my database."*  
3. **Seed:** Export that Google Sheet/JSON and run a script to insert it into your Supabase products table.

**Now your app *looks* like it pulls from a massive real-world inventory, but it's actually running on a fast, reliable, local dataset.**

