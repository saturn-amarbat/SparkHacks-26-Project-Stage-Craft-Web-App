import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import {
  inventorySemanticSearch,
  checkProductAvailability,
  createCartBundle,
} from "@/lib/ai/tools";
import { createClient } from "@/lib/supabase/server";

const googleApiKey = process.env.GOOGLE_API_KEY;
const genAI = googleApiKey ? new GoogleGenerativeAI(googleApiKey) : null;

const tools = [
  {
    name: "inventory_semantic_search",
    description:
      "Search for theatrical costumes, props, and equipment using semantic understanding. Use this when the user describes what they need for a role, character, production, or theatrical context. This tool understands context like historical periods (1920s, Victorian), character names (Hamlet, Ophelia), production styles (modern-dress, period-accurate), and theatrical requirements.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        query: {
          type: SchemaType.STRING,
          description:
            "Search query describing the item needed. Can include character names, periods, styles, or theatrical contexts.",
        },
        category: {
          type: SchemaType.STRING,
          description: "Filter by category (optional)",
        },
        limit: {
          type: SchemaType.NUMBER,
          description: "Maximum number of results to return",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "check_availability",
    description:
      "Check if a specific product is available for rental during given dates. Returns availability status and any conflicts.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        product_id: {
          type: SchemaType.STRING,
          description: "UUID of the product to check",
        },
        start_date: {
          type: SchemaType.STRING,
          description: "Rental start date in YYYY-MM-DD format",
        },
        end_date: {
          type: SchemaType.STRING,
          description: "Rental end date in YYYY-MM-DD format",
        },
      },
      required: ["product_id", "start_date", "end_date"],
    },
  },
  {
    name: "create_cart_bundle",
    description:
      "Add multiple items to the user's shopping cart at once. Use this after finding suitable products to pre-fill their cart. This is the key action that demonstrates anticipating customer needs.",
    parameters: {
      type: SchemaType.OBJECT,
      properties: {
        product_ids: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: "Array of product UUIDs to add to cart",
        },
        rental_dates: {
          type: SchemaType.OBJECT,
          properties: {
            start: {
              type: SchemaType.STRING,
              description: "Rental start date (YYYY-MM-DD)",
            },
            end: {
              type: SchemaType.STRING,
              description: "Rental end date (YYYY-MM-DD)",
            },
          },
          description: "Optional rental dates for all items",
        },
      },
      required: ["product_ids"],
    },
  },
];

const systemPrompt = `You are a shopping assistant for StageCraft, a theatrical equipment rental marketplace.

WHEN A USER DESCRIBES THEIR NEEDS:
1. Understand the context (character, era, production style, setting)
2. Use inventory_semantic_search to find relevant items
3. If dates are mentioned, use check_availability to verify availability
4. Add suitable items to their cart using create_cart_bundle
5. Explain your recommendations

CRITICAL RULES:
- Only recommend products returned by inventory_semantic_search
- Never invent products, prices, or availability information
- If no items are found, suggest alternative searches
- Be conversational and helpful

EXAMPLE:
User: "I'm playing Hamlet in a 1920s production"
You should:
1. Search for: "1920s formal menswear black tuxedo"
2. Search for: "skull prop Yorick"
3. Search for: "art deco accessories 1920s men"
4. Add found items to cart
5. Explain: "For a 1920s Hamlet, I've selected a period tuxedo, the iconic Yorick skull, and Art Deco accessories."`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Invalid chat payload" }, { status: 400 });
    }

    if (!genAI) {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return Response.json(
          { error: "Missing NEXT_PUBLIC_SUPABASE_URL in .env.local" },
          { status: 500 },
        );
      }

      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return Response.json(
          { error: "Missing SUPABASE_SERVICE_ROLE_KEY in .env.local" },
          { status: 500 },
        );
      }

      if (!process.env.OPENAI_API_KEY) {
        return Response.json(
          {
            error:
              "Missing OPENAI_API_KEY in .env.local. It is required for semantic search.",
          },
          { status: 500 },
        );
      }

      const lastMessage = messages[messages.length - 1]?.content || "";
      const searchResult = await inventorySemanticSearch(
        lastMessage,
        undefined,
        0.6,
        6,
      );

      if (!searchResult.success || !searchResult.products.length) {
        return Response.json({
          message:
            "I couldn't find matching items yet. Try adding a time period, character name, or prop type.",
          fallback: true,
        });
      }

      const productLines = searchResult.products
        .map(
          (product: any, index: number) =>
            `${index + 1}. ${product.name} (${product.category}) - $${product.rental_price_per_day}/day`,
        )
        .join("\n");

      return Response.json({
        message: `I found these options based on your request:\n${productLines}\n\nWant me to add any of these to your cart?`,
        fallback: true,
      });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Use demo user if not authenticated
    const userId = user?.id || "51bf926f-1055-4019-a2d9-fcee854806f7";

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      tools: [{ functionDeclarations: tools as any }],
      systemInstruction: systemPrompt,
    });

    // Convert messages to Gemini format
    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history });
    const lastMessage = messages[messages.length - 1].content;

    let result = await chat.sendMessage(lastMessage);
    let response = result.response;

    // Handle function calls iteratively
    while (true) {
      const functionCalls = response.functionCalls();
      if (!functionCalls || functionCalls.length === 0) {
        break;
      }

      const functionResponses = [];

      for (const functionCall of functionCalls) {
        let functionResult: any;

        try {
          if (functionCall.name === "inventory_semantic_search") {
            const args = functionCall.args as any;
            functionResult = await inventorySemanticSearch(
              args.query,
              args.category,
              0.7,
              args.limit || 5,
            );
          } else if (functionCall.name === "check_availability") {
            const args = functionCall.args as any;
            functionResult = await checkProductAvailability(
              args.product_id,
              args.start_date,
              args.end_date,
            );
          } else if (functionCall.name === "create_cart_bundle") {
            const args = functionCall.args as any;
            functionResult = await createCartBundle(
              userId,
              args.product_ids,
              args.rental_dates,
            );
          } else {
            functionResult = { error: "Unknown function" };
          }
        } catch (error: any) {
          console.error(`Error executing function ${functionCall.name}:`, error);
          functionResult = { error: error.message || "Function execution failed" };
        }

        functionResponses.push({
          functionResponse: {
            name: functionCall.name,
            response: functionResult,
          },
        });
      }

      // Send all function responses back to the model
      result = await chat.sendMessage(functionResponses);
      response = result.response;
    }

    const text = response.text();

    return Response.json({
      message: text || "No response generated",
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return Response.json(
      { error: "Failed to process chat request" },
      { status: 500 },
    );
  }
}
